#!/usr/bin/env python3
"""Fetch French AirDNA markets and enrich them from a local commune GeoJSON."""

from __future__ import annotations

import argparse
import base64
import json
import math
import os
import sys
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


AIRDNA_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = AIRDNA_DIR.parent.parent
AIRDNA_MARKETS_URL = "https://api.airdna.co/api/explorer/v1/country/fr/markets"
AIRDNA_FETCH_ID_TOKEN_URL = "https://api.airdna.co/auth/v1/fetch_id_token"
AIRDNA_FETCH_APP_TOKEN_URL = "https://api.airdna.co/auth/v1/fetch_app_token"
FUSIONAUTH_CLIENT_ID = "5f040464-0aef-48a1-a1d1-daa9fbf81415"
GEO_API_REGIONS_URL = "https://geo.api.gouv.fr/regions"
GEO_API_COMMUNES_URL = "https://geo.api.gouv.fr/communes"
DEFAULT_SESSION_PATH = AIRDNA_DIR / "session.local"
DEFAULT_COMMUNES_PATH = AIRDNA_DIR / "reference" / "communes-france.geojson"
DEFAULT_EXPORTS_DIR = AIRDNA_DIR / "exports"
EXPORT_TIME_ZONE = ZoneInfo("Europe/Paris")

DEFAULT_PAGE_SIZE = 200
MAX_PAGE_SIZE = 200
DEFAULT_AIRDNA_DELAY_SECONDS = 0.5
GEO_DOWNLOAD_DELAY_SECONDS = 0.25
MAX_ATTEMPTS = 3
MAX_PAGES = 1_000
MIN_COMMUNE_FEATURES = 30_000
REQUEST_TIMEOUT_SECONDS = 180
TOKEN_REFRESH_LEEWAY_SECONDS = 60
GRID_CELL_SIZE = 0.25
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/145.0.0.0 Safari/537.36"
)


class AuthenticationError(RuntimeError):
    """Raised when AirDNA rejects an authentication token."""


def positive_integer(value: str) -> int:
    parsed = int(value)
    if parsed <= 0:
        raise argparse.ArgumentTypeError("The value must be a positive integer.")
    return parsed


def page_size(value: str) -> int:
    parsed = positive_integer(value)
    if parsed > MAX_PAGE_SIZE:
        raise argparse.ArgumentTypeError(
            f"The AirDNA page size cannot exceed {MAX_PAGE_SIZE}."
        )
    return parsed


def non_negative_float(value: str) -> float:
    parsed = float(value)
    if parsed < 0:
        raise argparse.ArgumentTypeError("The value cannot be negative.")
    return parsed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Fetch all AirDNA markets in France, filtered to entire places, then "
            "enrich them from a cached official commune GeoJSON."
        )
    )
    parser.add_argument(
        "--output",
        type=Path,
        help=(
            "Write the JSON to this file. By default, create a dated file in "
            f"{DEFAULT_EXPORTS_DIR}."
        ),
    )
    parser.add_argument(
        "--session",
        type=Path,
        default=DEFAULT_SESSION_PATH,
        help=f"AirDNA session file (default: {DEFAULT_SESSION_PATH}).",
    )
    parser.add_argument(
        "--communes",
        type=Path,
        default=DEFAULT_COMMUNES_PATH,
        help=f"Cached commune GeoJSON (default: {DEFAULT_COMMUNES_PATH}).",
    )
    parser.add_argument(
        "--page-size",
        type=page_size,
        default=DEFAULT_PAGE_SIZE,
        help=f"AirDNA results per request, at most {MAX_PAGE_SIZE}.",
    )
    parser.add_argument(
        "--airdna-delay",
        type=non_negative_float,
        default=DEFAULT_AIRDNA_DELAY_SECONDS,
        help=(
            "Seconds to wait between AirDNA market requests "
            f"(default: {DEFAULT_AIRDNA_DELAY_SECONDS})."
        ),
    )
    parser.add_argument(
        "--limit",
        type=positive_integer,
        help="Stop after this many unique markets; omit to fetch every page.",
    )
    parser.add_argument(
        "--refresh-communes",
        action="store_true",
        help="Download the official commune GeoJSON again before extraction.",
    )
    parser.add_argument(
        "--download-communes-only",
        action="store_true",
        help="Download and validate the commune GeoJSON, then exit without calling AirDNA.",
    )
    return parser.parse_args()


def normalize_bearer_token(value: str) -> str:
    token = value.strip()
    if token.lower().startswith("bearer "):
        return token[7:].strip()
    return token


def decode_jwt_payload(token: str) -> dict[str, Any] | None:
    try:
        payload = token.split(".")[1]
        padding = "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload + padding).decode("utf-8")
        parsed = json.loads(decoded)
        return parsed if isinstance(parsed, dict) else None
    except (IndexError, UnicodeDecodeError, ValueError, json.JSONDecodeError):
        return None


def token_is_valid(token: str) -> bool:
    payload = decode_jwt_payload(token)
    expires_at = payload.get("exp") if payload else None
    return isinstance(expires_at, (int, float)) and expires_at > (
        time.time() + TOKEN_REFRESH_LEEWAY_SECONDS
    )


def load_session(path: Path) -> dict[str, Any]:
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise RuntimeError(
            f"AirDNA session file not found: {path}. "
            "Restore scripts/airdna-session.local from an authenticated browser session."
        ) from error
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Invalid AirDNA session file: {path}") from error

    if not isinstance(parsed, dict):
        raise RuntimeError(f"Invalid AirDNA session object in {path}")
    return parsed


def save_json_atomic(path: Path, value: Any, *, compact: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_name(f"{path.name}.tmp")
    try:
        with temporary_path.open("w", encoding="utf-8", newline="\n") as stream:
            if compact:
                json.dump(value, stream, ensure_ascii=False, separators=(",", ":"))
            else:
                json.dump(value, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        temporary_path.replace(path)
    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise


def save_session(path: Path, session: dict[str, Any]) -> None:
    save_json_atomic(path, session)


def request_json(
    request: Request,
    *,
    authentication_error_message: str | None = None,
) -> Any:
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                charset = response.headers.get_content_charset() or "utf-8"
                return json.loads(response.read().decode(charset))
        except HTTPError as error:
            response_body = error.read().decode("utf-8", errors="replace")
            if error.code in {401, 403} and authentication_error_message:
                raise AuthenticationError(authentication_error_message) from error

            if error.code == 429 or error.code >= 500:
                if attempt < MAX_ATTEMPTS:
                    retry_after = error.headers.get("Retry-After")
                    delay = int(retry_after) if retry_after and retry_after.isdigit() else attempt
                    time.sleep(delay)
                    continue

            preview = response_body[:300].replace("\n", " ")
            raise RuntimeError(
                f"Request failed with HTTP {error.code}: {preview}"
            ) from error
        except (URLError, TimeoutError) as error:
            if attempt < MAX_ATTEMPTS:
                time.sleep(attempt)
                continue
            reason = getattr(error, "reason", str(error))
            raise RuntimeError(f"Unable to reach {request.full_url}: {reason}") from error
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise RuntimeError(f"Invalid JSON returned by {request.full_url}") from error

    raise RuntimeError(f"Request failed after all retries: {request.full_url}")


def get_json(url: str) -> Any:
    return request_json(
        Request(
            url,
            headers={"Accept": "application/json", "User-Agent": USER_AGENT},
        )
    )


def post_json(
    url: str,
    payload: dict[str, Any],
    *,
    headers: dict[str, str] | None = None,
    authentication_error_message: str | None = None,
) -> Any:
    request_headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Origin": "https://app.airdna.co",
        "Referer": "https://app.airdna.co/",
        "User-Agent": USER_AGENT,
    }
    if headers:
        request_headers.update(headers)

    request = Request(
        url,
        data=json.dumps(payload, separators=(",", ":")).encode("utf-8"),
        method="POST",
        headers=request_headers,
    )
    return request_json(
        request, authentication_error_message=authentication_error_message
    )


def refresh_app_token(session_path: Path, session: dict[str, Any]) -> str:
    refresh_token = session.get("fusionauth_refresh_token")
    if not isinstance(refresh_token, str) or not refresh_token:
        raise RuntimeError(f"fusionauth_refresh_token is missing from {session_path}")

    id_token_response = post_json(
        AIRDNA_FETCH_ID_TOKEN_URL,
        {
            "refresh_token": refresh_token,
            "client_id": FUSIONAUTH_CLIENT_ID,
        },
        authentication_error_message=(
            "The AirDNA refresh token was rejected. Recreate the local session file "
            "from an authenticated browser session."
        ),
    )
    if not isinstance(id_token_response, dict):
        raise RuntimeError("AirDNA returned an invalid ID token response.")

    id_token = id_token_response.get("id_token")
    if not isinstance(id_token, str) or not id_token:
        raise RuntimeError("AirDNA did not return an ID token.")

    app_token_response = post_json(
        AIRDNA_FETCH_APP_TOKEN_URL,
        {"impersonate_id": None, "ingress_params": None},
        headers={"Authorization": f"Bearer {id_token}"},
        authentication_error_message="AirDNA rejected the refreshed ID token.",
    )
    if not isinstance(app_token_response, dict):
        raise RuntimeError("AirDNA returned an invalid app token response.")

    app_token = app_token_response.get("token")
    if not isinstance(app_token, str) or not app_token:
        raise RuntimeError("AirDNA did not return an app token.")

    new_refresh_token = id_token_response.get("refresh_token")
    session.update(
        {
            "app_token": app_token,
            "fusionauth_id_token": id_token,
            "fusionauth_refresh_token": (
                new_refresh_token
                if isinstance(new_refresh_token, str) and new_refresh_token
                else refresh_token
            ),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    save_session(session_path, session)
    return app_token


def get_app_token(session_path: Path, *, force_refresh: bool = False) -> str:
    environment_token = normalize_bearer_token(
        os.environ.get("AIRDNA_BEARER_TOKEN", "")
    )
    if environment_token and not force_refresh:
        return environment_token

    session = load_session(session_path)
    app_token = session.get("app_token")
    if not force_refresh and isinstance(app_token, str) and token_is_valid(app_token):
        return app_token

    return refresh_app_token(session_path, session)


def build_markets_payload(offset: int, requested_page_size: int) -> dict[str, Any]:
    return {
        "filters": [
            {
                "type": "select",
                "field": "listing_type",
                "value": "entire_place",
            }
        ],
        "sort_order": "market_score",
        "pagination": {"page_size": requested_page_size, "offset": offset},
        "currency": "eur",
        "include_geoms": True,
        "include_images": False,
        "compute_metrics": True,
        "metrics": ["listing_count"],
    }


def fetch_market_page(
    token: str,
    *,
    offset: int,
    requested_page_size: int,
) -> list[dict[str, Any]]:
    parsed = post_json(
        AIRDNA_MARKETS_URL,
        build_markets_payload(offset, requested_page_size),
        headers={
            "Authorization": f"Bearer {token}",
            "X-Requested-With": "disableCaseConversion",
        },
        authentication_error_message="AirDNA rejected the app token.",
    )
    if not isinstance(parsed, dict):
        raise RuntimeError("AirDNA returned a non-object JSON response.")
    payload = parsed.get("payload")
    if not isinstance(payload, dict):
        raise RuntimeError("AirDNA response does not contain a payload object.")
    markets = payload.get("markets")
    if not isinstance(markets, list):
        raise RuntimeError("AirDNA response does not contain a markets array.")
    return [market for market in markets if isinstance(market, dict)]


def normalize_market(raw_market: dict[str, Any]) -> dict[str, Any]:
    metrics = raw_market.get("metrics")
    geospatial = raw_market.get("geospatial")
    point = geospatial.get("geom_pt") if isinstance(geospatial, dict) else None
    return {
        "market_id": raw_market.get("id"),
        "name": raw_market.get("name"),
        "country_code": raw_market.get("country_code"),
        "short_term_rental_listings_entire_place_ltm": (
            metrics.get("listing_count") if isinstance(metrics, dict) else None
        ),
        "latitude": point.get("lat") if isinstance(point, dict) else None,
        "longitude": point.get("lng") if isinstance(point, dict) else None,
    }


def fetch_all_markets(
    session_path: Path,
    *,
    requested_page_size: int,
    request_delay: float,
    limit: int | None,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    token = get_app_token(session_path)
    markets: list[dict[str, Any]] = []
    seen_market_ids: set[str] = set()
    page_signatures: set[tuple[str, ...]] = set()
    duplicate_count = 0
    raw_market_count = 0
    offset = 0
    pages_fetched = 0
    collection_end: str | None = None

    while pages_fetched < MAX_PAGES:
        remaining = limit - len(markets) if limit is not None else None
        if remaining is not None and remaining <= 0:
            collection_end = "limit"
            break
        current_page_size = (
            min(requested_page_size, remaining)
            if remaining is not None
            else requested_page_size
        )

        if pages_fetched > 0 and request_delay > 0:
            print(
                f"Waiting {request_delay:g}s before the next AirDNA request...",
                file=sys.stderr,
            )
            time.sleep(request_delay)

        print(
            f"Fetching AirDNA page {pages_fetched + 1} "
            f"(offset={offset}, page_size={current_page_size})...",
            file=sys.stderr,
        )
        try:
            raw_page = fetch_market_page(
                token,
                offset=offset,
                requested_page_size=current_page_size,
            )
        except AuthenticationError:
            token = get_app_token(session_path, force_refresh=True)
            raw_page = fetch_market_page(
                token,
                offset=offset,
                requested_page_size=current_page_size,
            )

        pages_fetched += 1
        if not raw_page:
            collection_end = "empty_page"
            break

        signature = tuple(str(market.get("id")) for market in raw_page)
        if signature in page_signatures:
            raise RuntimeError(
                "AirDNA returned the same page twice; pagination was stopped to avoid a loop."
            )
        page_signatures.add(signature)
        raw_market_count += len(raw_page)

        for raw_market in raw_page:
            market = normalize_market(raw_market)
            market_id = str(market.get("market_id"))
            if market_id in seen_market_ids:
                duplicate_count += 1
                continue
            seen_market_ids.add(market_id)
            markets.append(market)

        if limit is not None and len(markets) >= limit:
            markets = markets[:limit]
            collection_end = "limit"
            break
        if len(raw_page) < current_page_size:
            collection_end = "short_page"
            break
        offset += current_page_size

    if collection_end is None:
        raise RuntimeError(f"Pagination exceeded the safety limit of {MAX_PAGES} pages.")

    return markets, {
        "pages_fetched": pages_fetched,
        "raw_market_count": raw_market_count,
        "duplicate_market_count": duplicate_count,
        "collection_complete": collection_end in {"empty_page", "short_page"},
        "collection_end": collection_end,
    }


def commune_download_url(region_code: str) -> str:
    query = urlencode(
        {
            "codeRegion": region_code,
            "fields": (
                "nom,code,codesPostaux,codeDepartement,departement,codeRegion,region"
            ),
            "format": "geojson",
            "geometry": "contour",
        }
    )
    return f"{GEO_API_COMMUNES_URL}?{query}"


def download_commune_reference(path: Path) -> int:
    regions = get_json(GEO_API_REGIONS_URL)
    if not isinstance(regions, list) or not regions:
        raise RuntimeError("The official geographic API returned no regions.")

    region_entries = [region for region in regions if isinstance(region, dict)]
    region_entries.sort(key=lambda region: str(region.get("code", "")))
    features: list[dict[str, Any]] = []
    source_urls: list[str] = []

    for index, region in enumerate(region_entries):
        region_code = region.get("code")
        if not isinstance(region_code, str) or not region_code:
            continue
        if index > 0:
            time.sleep(GEO_DOWNLOAD_DELAY_SECONDS)

        url = commune_download_url(region_code)
        print(
            f"Downloading communes for region {region_code} "
            f"({index + 1}/{len(region_entries)})...",
            file=sys.stderr,
        )
        geojson = get_json(url)
        if not isinstance(geojson, dict) or geojson.get("type") != "FeatureCollection":
            raise RuntimeError(f"Invalid commune GeoJSON for region {region_code}.")
        region_features = geojson.get("features")
        if not isinstance(region_features, list):
            raise RuntimeError(f"Missing commune features for region {region_code}.")
        features.extend(
            feature for feature in region_features if isinstance(feature, dict)
        )
        source_urls.append(url)

    if len(features) < MIN_COMMUNE_FEATURES:
        raise RuntimeError(
            f"The commune reference looks incomplete: only {len(features)} features."
        )

    document = {
        "type": "FeatureCollection",
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source": GEO_API_COMMUNES_URL,
            "region_count": len(source_urls),
            "commune_count": len(features),
            "source_urls": source_urls,
        },
        "features": features,
    }
    save_json_atomic(path, document, compact=True)
    print(f"Saved {len(features)} communes to {path}.", file=sys.stderr)
    return len(features)


def ensure_commune_reference(path: Path, *, refresh: bool) -> None:
    if refresh or not path.exists():
        download_commune_reference(path)


def iter_positions(coordinates: Any) -> Iterable[tuple[float, float]]:
    if not isinstance(coordinates, list):
        return
    if (
        len(coordinates) >= 2
        and isinstance(coordinates[0], (int, float))
        and isinstance(coordinates[1], (int, float))
    ):
        yield float(coordinates[0]), float(coordinates[1])
        return
    for child in coordinates:
        yield from iter_positions(child)


def geometry_bounds(geometry: dict[str, Any]) -> tuple[float, float, float, float] | None:
    positions = list(iter_positions(geometry.get("coordinates")))
    if not positions:
        return None
    longitudes = [position[0] for position in positions]
    latitudes = [position[1] for position in positions]
    return min(longitudes), min(latitudes), max(longitudes), max(latitudes)


def point_on_segment(
    longitude: float,
    latitude: float,
    start: list[Any],
    end: list[Any],
) -> bool:
    if len(start) < 2 or len(end) < 2:
        return False
    x1, y1 = float(start[0]), float(start[1])
    x2, y2 = float(end[0]), float(end[1])
    cross_product = (longitude - x1) * (y2 - y1) - (latitude - y1) * (x2 - x1)
    if abs(cross_product) > 1e-10:
        return False
    return (
        min(x1, x2) - 1e-10 <= longitude <= max(x1, x2) + 1e-10
        and min(y1, y2) - 1e-10 <= latitude <= max(y1, y2) + 1e-10
    )


def point_in_ring(longitude: float, latitude: float, ring: Any) -> bool:
    if not isinstance(ring, list) or len(ring) < 3:
        return False
    inside = False
    previous = ring[-1]
    for current in ring:
        if not isinstance(current, list) or not isinstance(previous, list):
            previous = current
            continue
        if len(current) < 2 or len(previous) < 2:
            previous = current
            continue
        if point_on_segment(longitude, latitude, previous, current):
            return True
        x1, y1 = float(previous[0]), float(previous[1])
        x2, y2 = float(current[0]), float(current[1])
        crosses_latitude = (y1 > latitude) != (y2 > latitude)
        if crosses_latitude:
            intersection = (x2 - x1) * (latitude - y1) / (y2 - y1) + x1
            if longitude < intersection:
                inside = not inside
        previous = current
    return inside


def point_in_polygon(longitude: float, latitude: float, polygon: Any) -> bool:
    if not isinstance(polygon, list) or not polygon:
        return False
    if not point_in_ring(longitude, latitude, polygon[0]):
        return False
    return not any(point_in_ring(longitude, latitude, hole) for hole in polygon[1:])


def point_in_geometry(
    longitude: float,
    latitude: float,
    geometry: dict[str, Any],
) -> bool:
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    if geometry_type == "Polygon":
        return point_in_polygon(longitude, latitude, coordinates)
    if geometry_type == "MultiPolygon" and isinstance(coordinates, list):
        return any(
            point_in_polygon(longitude, latitude, polygon)
            for polygon in coordinates
        )
    return False


def normalize_commune_name(value: Any) -> str:
    if not isinstance(value, str):
        return ""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    return "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character) and character.isalnum()
    )


class CommuneIndex:
    def __init__(self, path: Path) -> None:
        try:
            with path.open("r", encoding="utf-8") as stream:
                document = json.load(stream)
        except FileNotFoundError as error:
            raise RuntimeError(f"Commune reference not found: {path}") from error
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise RuntimeError(f"Invalid commune GeoJSON: {path}") from error

        features = document.get("features") if isinstance(document, dict) else None
        if not isinstance(features, list):
            raise RuntimeError(f"Commune GeoJSON has no features array: {path}")

        self.entries: list[dict[str, Any]] = []
        self.grid: dict[tuple[int, int], list[int]] = {}
        self.names: dict[str, list[int]] = {}
        for feature in features:
            if not isinstance(feature, dict):
                continue
            properties = feature.get("properties")
            geometry = feature.get("geometry")
            if not isinstance(properties, dict) or not isinstance(geometry, dict):
                continue
            bounds = geometry_bounds(geometry)
            if bounds is None:
                continue

            entry_index = len(self.entries)
            self.entries.append(
                {
                    "properties": properties,
                    "geometry": geometry,
                    "bounds": bounds,
                }
            )
            normalized_name = normalize_commune_name(properties.get("nom"))
            if normalized_name:
                self.names.setdefault(normalized_name, []).append(entry_index)
            min_lon, min_lat, max_lon, max_lat = bounds
            min_x = math.floor(min_lon / GRID_CELL_SIZE)
            max_x = math.floor(max_lon / GRID_CELL_SIZE)
            min_y = math.floor(min_lat / GRID_CELL_SIZE)
            max_y = math.floor(max_lat / GRID_CELL_SIZE)
            for grid_x in range(min_x, max_x + 1):
                for grid_y in range(min_y, max_y + 1):
                    self.grid.setdefault((grid_x, grid_y), []).append(entry_index)

        if len(self.entries) < MIN_COMMUNE_FEATURES:
            raise RuntimeError(
                f"Commune reference looks incomplete: {len(self.entries)} usable features."
            )

    def lookup(self, longitude: float, latitude: float) -> dict[str, Any] | None:
        grid_key = (
            math.floor(longitude / GRID_CELL_SIZE),
            math.floor(latitude / GRID_CELL_SIZE),
        )
        for entry_index in self.grid.get(grid_key, []):
            entry = self.entries[entry_index]
            min_lon, min_lat, max_lon, max_lat = entry["bounds"]
            if not (
                min_lon <= longitude <= max_lon
                and min_lat <= latitude <= max_lat
            ):
                continue
            if point_in_geometry(longitude, latitude, entry["geometry"]):
                return entry["properties"]
        return None

    def lookup_by_name(
        self,
        name: Any,
        longitude: float | None,
        latitude: float | None,
    ) -> dict[str, Any] | None:
        candidates = self.names.get(normalize_commune_name(name), [])
        if not candidates:
            return None
        if len(candidates) == 1 or longitude is None or latitude is None:
            return self.entries[candidates[0]]["properties"]

        def distance_to_bounds(entry_index: int) -> float:
            min_lon, min_lat, max_lon, max_lat = self.entries[entry_index]["bounds"]
            longitude_distance = max(min_lon - longitude, 0, longitude - max_lon)
            latitude_distance = max(min_lat - latitude, 0, latitude - max_lat)
            return longitude_distance**2 + latitude_distance**2

        closest_index = min(candidates, key=distance_to_bounds)
        return self.entries[closest_index]["properties"]


def enrich_markets(
    markets: list[dict[str, Any]],
    commune_index: CommuneIndex,
) -> tuple[int, list[str], dict[str, int]]:
    matched_count = 0
    unmatched_market_ids: list[str] = []
    match_methods = {"point_in_polygon": 0, "normalized_name": 0}

    for market in markets:
        commune: dict[str, Any] | None = None
        match_method: str | None = None
        latitude = market.get("latitude")
        longitude = market.get("longitude")
        if isinstance(latitude, (int, float)) and isinstance(longitude, (int, float)):
            commune = commune_index.lookup(float(longitude), float(latitude))
            if commune:
                match_method = "point_in_polygon"

        if commune is None:
            commune = commune_index.lookup_by_name(
                market.get("name"),
                float(longitude) if isinstance(longitude, (int, float)) else None,
                float(latitude) if isinstance(latitude, (int, float)) else None,
            )
            if commune:
                match_method = "normalized_name"

        department = commune.get("departement") if commune else None
        region = commune.get("region") if commune else None
        postal_codes = commune.get("codesPostaux") if commune else None
        normalized_postal_codes = postal_codes if isinstance(postal_codes, list) else []
        if commune:
            matched_count += 1
            match_methods[match_method or "normalized_name"] += 1
        else:
            unmatched_market_ids.append(str(market.get("market_id")))

        market.update(
            {
                "official_commune_name": commune.get("nom") if commune else None,
                "administrative_match_method": match_method,
                "code_insee": commune.get("code") if commune else None,
                "postal_code": (
                    normalized_postal_codes[0] if normalized_postal_codes else None
                ),
                "postal_codes": normalized_postal_codes,
                "department_code": (
                    department.get("code")
                    if isinstance(department, dict)
                    else commune.get("codeDepartement") if commune else None
                ),
                "department_name": (
                    department.get("nom") if isinstance(department, dict) else None
                ),
                "region_code": (
                    region.get("code")
                    if isinstance(region, dict)
                    else commune.get("codeRegion") if commune else None
                ),
                "region_name": region.get("nom") if isinstance(region, dict) else None,
            }
        )

    return matched_count, unmatched_market_ids, match_methods


def build_output(
    markets: list[dict[str, Any]],
    commune_index: CommuneIndex,
    pagination: dict[str, Any],
    *,
    commune_source: Path,
    page_size_value: int,
    request_delay: float,
) -> dict[str, Any]:
    matched_count, unmatched_market_ids, match_methods = enrich_markets(
        markets, commune_index
    )
    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source": AIRDNA_MARKETS_URL,
            "administrative_source": display_path(commune_source),
            "country_code": "fr",
            "sort_order": "market_score",
            "page_size": page_size_value,
            "pages_fetched": pagination["pages_fetched"],
            "airdna_request_delay_seconds": request_delay,
            "raw_market_count": pagination["raw_market_count"],
            "duplicate_market_count": pagination["duplicate_market_count"],
            "collection_complete": pagination["collection_complete"],
            "collection_end": pagination["collection_end"],
            "count": len(markets),
            "administrative_matches": matched_count,
            "administrative_match_methods": match_methods,
            "unmatched_market_ids": unmatched_market_ids,
            "filters": {"listing_type": "entire_place"},
            "metric": {
                "name": "short_term_rental_listings_entire_place_ltm",
                "source_field": "listing_count",
                "period": "trailing_12_months",
            },
        },
        "markets": markets,
    }


def display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        return str(path)


def build_dated_output_path() -> Path:
    timestamp = datetime.now(EXPORT_TIME_ZONE).strftime("%Y-%m-%d_%H%M%S")
    return DEFAULT_EXPORTS_DIR / f"airdna-france-{timestamp}.json"


def write_output(result: dict[str, Any], output_path: Path) -> None:

    save_json_atomic(output_path, result)
    print(f"Generated {len(result['markets'])} markets in {output_path}.", file=sys.stderr)


def main() -> int:
    try:
        args = parse_args()
        ensure_commune_reference(args.communes, refresh=args.refresh_communes)
        commune_index = CommuneIndex(args.communes)
        print(
            f"Loaded {len(commune_index.entries)} commune polygons from {args.communes}.",
            file=sys.stderr,
        )

        if args.download_communes_only:
            return 0

        markets, pagination = fetch_all_markets(
            args.session,
            requested_page_size=args.page_size,
            request_delay=args.airdna_delay,
            limit=args.limit,
        )
        result = build_output(
            markets,
            commune_index,
            pagination,
            commune_source=args.communes,
            page_size_value=args.page_size,
            request_delay=args.airdna_delay,
        )
        write_output(result, args.output or build_dated_output_path())
        return 0
    except (RuntimeError, OSError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
