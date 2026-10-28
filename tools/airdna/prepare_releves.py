#!/usr/bin/env python3
"""Prépare hors ligne un export de marchés pour l'import territorial Etoilys."""

from __future__ import annotations

import argparse
import csv
import gzip
import hashlib
import json
import math
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

from fetch_markets import GRID_CELL_SIZE, geometry_bounds, normalize_commune_name, point_in_geometry

REFERENCE_DIR = Path(__file__).resolve().parent / "reference" / "2026"
LEGACY_SHA256 = "69251636DC384FBF5947F536998D501C99677E347AB5285AB301A53FB85EDA82"
METRIC_NAME = "short_term_rental_listings_entire_place_ltm"
OVERLAP_ASSUMPTION = "distinct_listings"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ValueError(f"JSON illisible : {path}") from error
    if not isinstance(value, dict):
        raise ValueError(f"Objet JSON attendu : {path}")
    return value


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as stream:
        return list(csv.DictReader(stream))


def required_text(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label} est obligatoire")
    return value.strip()


def load_manifest(reference_dir: Path) -> tuple[dict[str, Path], dict[str, str]]:
    manifest = read_json(reference_dir / "manifest.json")
    if manifest.get("millesime") != 2026 or not isinstance(manifest.get("sources"), dict):
        raise ValueError("Manifeste du référentiel 2026 invalide")
    paths: dict[str, Path] = {}
    hashes: dict[str, str] = {}
    for key in ("cog", "contours", "history", "events"):
        source = manifest["sources"].get(key)
        if not isinstance(source, dict):
            raise ValueError(f"Source {key} absente du manifeste")
        name = required_text(source.get("file"), f"Fichier {key}")
        if Path(name).name != name:
            raise ValueError(f"Nom de fichier {key} invalide")
        path = reference_dir / name
        expected = required_text(source.get("sha256"), f"SHA-256 {key}").upper()
        if sha256(path) != expected:
            raise ValueError(f"Empreinte incorrecte pour {path}")
        paths[key], hashes[key] = path, expected
    return paths, hashes


class GeographicReference:
    def __init__(self, reference_dir: Path = REFERENCE_DIR) -> None:
        paths, self.hashes = load_manifest(reference_dir)
        rows = read_csv(paths["cog"])
        self.communes = {r["COM"] for r in rows if r["TYPECOM"] == "COM"}
        if len(self.communes) < 30_000:
            raise ValueError("Référentiel des communes incomplet")
        self.localities: dict[tuple[str, str], str] = {}
        self.names: dict[str, dict[str, set[str]]] = {
            "current": defaultdict(set),
            "locality": defaultdict(set),
            "historical": defaultdict(set),
        }
        for row in rows:
            kind, code = row["TYPECOM"], row["COM"]
            if kind == "COM":
                target, category = code, "current"
            elif kind in {"COMA", "COMD", "ARM"}:
                target, category = row["COMPARENT"], "locality"
                if target not in self.communes:
                    raise ValueError(f"Commune parente absente pour {kind} {code}")
                self.localities[kind, code] = target
            else:
                continue
            for field in ("NCCENR", "LIBELLE"):
                name = normalize_commune_name(row[field])
                if name:
                    self.names[category][name].add(target)

        transitions: dict[tuple[str, str], set[tuple[str, str]]] = defaultdict(set)
        for row in read_csv(paths["events"]):
            before = row["TYPECOM_AV"], row["COM_AV"]
            after = row["TYPECOM_AP"], row["COM_AP"]
            if before != after:
                transitions[before].add(after)

        def current_targets(start: tuple[str, str]) -> set[str]:
            targets: set[str] = set()
            pending = [start]
            visited: set[tuple[str, str]] = set()
            while pending:
                state = pending.pop()
                if state in visited:
                    continue
                visited.add(state)
                kind, code = state
                if kind == "COM" and code in self.communes:
                    targets.add(code)
                parent = self.localities.get(state)
                if parent:
                    targets.add(parent)
                pending.extend(transitions.get(state, ()))
            return targets

        target_cache: dict[tuple[str, str], set[str]] = {}
        for row in read_csv(paths["history"]):
            state = row["TYPECOM"], row["COM"]
            if state not in target_cache:
                target_cache[state] = current_targets(state)
            for field in ("NCCENR", "LIBELLE"):
                name = normalize_commune_name(row[field])
                if name:
                    self.names["historical"][name].update(target_cache[state])

        with gzip.open(paths["contours"], "rt", encoding="utf-8") as stream:
            geojson = json.load(stream)
        features = geojson.get("features") if isinstance(geojson, dict) else None
        if not isinstance(features, list):
            raise ValueError("Contours 2026 invalides")
        self.entries: list[tuple[str, dict[str, Any], tuple[float, float, float, float]]] = []
        self.grid: dict[tuple[int, int], list[int]] = defaultdict(list)
        self.by_code: dict[str, list[int]] = defaultdict(list)
        covered: set[str] = set()
        for feature in features:
            if not isinstance(feature, dict):
                continue
            properties, geometry = feature.get("properties"), feature.get("geometry")
            if not isinstance(properties, dict) or not isinstance(geometry, dict):
                continue
            code = properties.get("code")
            if code in self.communes:
                parent = code
                covered.add(code)
            else:
                parent = self.localities.get(("ARM", code))
            if not parent:
                continue
            bounds = geometry_bounds(geometry)
            if bounds is None:
                continue
            index = len(self.entries)
            self.entries.append((parent, geometry, bounds))
            self.by_code[parent].append(index)
            min_lon, min_lat, max_lon, max_lat = bounds
            for x in range(math.floor(min_lon / GRID_CELL_SIZE), math.floor(max_lon / GRID_CELL_SIZE) + 1):
                for y in range(math.floor(min_lat / GRID_CELL_SIZE), math.floor(max_lat / GRID_CELL_SIZE) + 1):
                    self.grid[x, y].append(index)
        if covered != self.communes:
            raise ValueError(f"Contours/COG incohérents : {len(self.communes - covered)} communes manquantes")

    def point_code(self, longitude: Any, latitude: Any) -> str | None:
        if (isinstance(longitude, bool) or isinstance(latitude, bool)
                or not isinstance(longitude, (int, float)) or not isinstance(latitude, (int, float))
                or not math.isfinite(longitude) or not math.isfinite(latitude)):
            return None
        cell = math.floor(longitude / GRID_CELL_SIZE), math.floor(latitude / GRID_CELL_SIZE)
        for index in self.grid.get(cell, ()):
            parent, geometry, (min_lon, min_lat, max_lon, max_lat) = self.entries[index]
            if min_lon <= longitude <= max_lon and min_lat <= latitude <= max_lat:
                if point_in_geometry(longitude, latitude, geometry):
                    return parent
        return None

    def nearest(self, candidates: set[str], longitude: Any, latitude: Any) -> str:
        if not isinstance(longitude, (int, float)) or not isinstance(latitude, (int, float)):
            return sorted(candidates)[0]
        def distance(code: str) -> float:
            return min(
                max(b[0] - longitude, 0, longitude - b[2]) ** 2
                + max(b[1] - latitude, 0, latitude - b[3]) ** 2
                for index in self.by_code[code] for b in (self.entries[index][2],)
            )
        return min(sorted(candidates), key=distance)

    def candidates(self, name: str) -> dict[str, str]:
        key = normalize_commune_name(name)
        # La catégorie la plus précise prime pour un même code, mais un homonyme
        # historique reste candidat même si un nom actuel existe ailleurs.
        result: dict[str, str] = {}
        for category in ("historical", "locality", "current"):
            for code in self.names[category].get(key, ()):
                result[code] = category
        return result

def load_decisions(
    path: Path | None, original_hash: str, communes: set[str]
) -> tuple[dict[str, dict[str, str]], dict[str, Any] | None, str | None]:
    if path is None:
        return {}, None, None
    document = read_json(path)
    if required_text(document.get("original_sha256"), "Empreinte de l'original").upper() != original_hash:
        raise ValueError("Les décisions concernent un autre export original")
    corrections = document.get("corrections", [])
    if not isinstance(corrections, list):
        raise ValueError("La liste des corrections est invalide")
    by_id: dict[str, dict[str, str]] = {}
    for correction in corrections:
        if not isinstance(correction, dict):
            raise ValueError("Une correction doit être un objet")
        market_id = required_text(correction.get("market_id"), "market_id de correction")
        code = required_text(correction.get("code_insee"), "code_insee de correction")
        operator = required_text(correction.get("operator"), "opérateur de correction")
        reason = required_text(correction.get("reason"), "motif de correction")
        if code not in communes or market_id in by_id:
            raise ValueError(f"Correction invalide ou répétée pour {market_id} vers {code}")
        by_id[market_id] = {"code_insee": code, "operator": operator, "reason": reason}
    attestation = document.get("attestation")
    if attestation is not None:
        if not isinstance(attestation, dict):
            raise ValueError("Attestation invalide")
        required_text(attestation.get("operator"), "opérateur de l'attestation")
        required_text(attestation.get("reason"), "motif de l'attestation")
    return by_id, attestation, sha256(path)

def validate_original(path: Path) -> tuple[dict[str, Any], list[dict[str, Any]], str, str]:
    original = read_json(path)
    metadata, markets = original.get("metadata"), original.get("markets")
    if not isinstance(metadata, dict) or not isinstance(markets, list) or not markets:
        raise ValueError("Export sans métadonnées ou marchés")
    metric = metadata.get("metric")
    if not isinstance(metric, dict) or (
        metric.get("name") != METRIC_NAME or metric.get("source_field") != "listing_count"
        or metric.get("period") != "trailing_12_months"
        or metadata.get("filters") != {"listing_type": "entire_place"}
        or metadata.get("country_code") != "fr"
    ):
        raise ValueError("Métrique ou filtre inattendu")
    if metadata.get("count") != len(markets):
        raise ValueError("Nombre de marchés incohérent")
    if metadata.get("raw_market_count") != len(markets) + metadata.get("duplicate_market_count", -1):
        raise ValueError("Pagination ou doublons incohérents")
    generated_at = required_text(metadata.get("generated_at"), "generated_at")
    try:
        extracted_at = datetime.fromisoformat(generated_at)
    except ValueError as error:
        raise ValueError("Date d'extraction invalide") from error
    if extracted_at.tzinfo is None or extracted_at.year != 2026:
        raise ValueError("Date d'extraction incompatible avec le millésime 2026")
    seen: set[str] = set()
    for market in markets:
        if not isinstance(market, dict):
            raise ValueError("Marché non objet")
        market_id = required_text(market.get("market_id"), "market_id")
        if market_id in seen:
            raise ValueError(f"market_id répété : {market_id}")
        seen.add(market_id)
        required_text(market.get("name"), f"Nom du marché {market_id}")
        volume = market.get(METRIC_NAME)
        if isinstance(volume, bool) or not isinstance(volume, int) or volume < 0:
            raise ValueError(f"Volume invalide pour le marché {market_id}")
        if market.get("country_code") != "fr":
            raise ValueError(f"Pays inattendu pour le marché {market_id}")
    return metadata, markets, sha256(path), generated_at


def prepare(
    original_path: Path,
    decisions_path: Path | None = None,
    reference_dir: Path = REFERENCE_DIR,
) -> tuple[dict[str, Any], dict[str, Any]]:
    reference = GeographicReference(reference_dir)
    original_meta, markets, original_hash, generated_at = validate_original(original_path)
    corrections, attestation, corrections_hash = load_decisions(
        decisions_path, original_hash, reference.communes
    )
    if (original_meta.get("collection_complete") is True
            and original_meta.get("collection_end") in {"empty_page", "short_page"}):
        completeness: dict[str, Any] = {"status": "verified"}
    elif original_hash == LEGACY_SHA256 and attestation is not None:
        completeness = {"status": "attested", **attestation}
    else:
        raise ValueError("Collecte non terminée ou sans attestation liée à l'original")
    unknown_corrections = corrections.keys() - {m["market_id"] for m in markets}
    if unknown_corrections:
        raise ValueError(f"Corrections de marchés inconnus : {sorted(unknown_corrections)}")

    prepared_markets: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    qualities: Counter[str] = Counter()
    methods: Counter[str] = Counter()
    total_volume = excluded_volume = 0
    for market in markets:
        market_id, name, volume = market["market_id"], market["name"], market[METRIC_NAME]
        total_volume += volume
        point = reference.point_code(market.get("longitude"), market.get("latitude"))
        options = reference.candidates(name)
        reasons: list[str] = []
        if market_id in corrections:
            code, method, quality = corrections[market_id]["code_insee"], "manual", "HIGH"
            reasons.append("manual_override")
        elif options:
            if point in options:
                code = point
                category = options[code]
                method = f"{category}_point"
                quality = "HIGH" if category != "historical" else "MEDIUM"
            elif len(options) == 1:
                code = next(iter(options))
                category = options[code]
                method = f"{category}_unique"
                quality = "HIGH" if point is None and category == "current" else "MEDIUM"
            else:
                code = reference.nearest(set(options), market.get("longitude"), market.get("latitude"))
                category = options[code]
                method, quality = f"{category}_nearest", "LOW"
            if point is not None and point != code:
                reasons.append("nom_point_disagree")
            if category == "historical":
                reasons.append("historical_name_or_perimeter")
        elif point is not None:
            code, method, quality = point, "point_only", "LOW"
            reasons.append("point_only")
        else:
            code, method, quality = None, "unmatched", "UNMATCHED"
            reasons.append("unmatched")
            excluded_volume += volume
        old_code = market.get("code_insee")
        if old_code != code:
            reasons.append("original_code_changed")
        if quality != "HIGH" or reasons:
            warnings.append({
                "market_id": market_id, "name": name, "volume": volume,
                "code_insee": code, "original_code_insee": old_code,
                "point_code_insee": point, "candidates": sorted(options),
                "match_method": method, "match_quality": quality, "reasons": reasons,
                "correction": ({"operator": corrections[market_id]["operator"], "reason": corrections[market_id]["reason"]} if market_id in corrections else None),
            })
        qualities[quality] += 1
        methods[method] += 1
        prepared_market: dict[str, Any] = {
            "market_id": market_id, "name": name, "code_insee": code, "volume": volume,
            "match_method": method, "match_quality": quality,
            "original_code_insee": old_code,
        }
        if market_id in corrections:
            prepared_market["correction"] = {
                "operator": corrections[market_id]["operator"],
                "reason": corrections[market_id]["reason"],
            }
        prepared_markets.append(prepared_market)
    metadata = {
        "format": "etoilys-releves-1", "millesime": 2026,
        "generated_at": generated_at, "original_sha256": original_hash,
        "original_file_name": original_path.name, "reference_sha256": reference.hashes,
        "corrections_sha256": corrections_hash, "completeness": completeness,
        "metric": {"name": METRIC_NAME, "period": "trailing_12_months"},
        "market_count": len(prepared_markets), "unmatched_count": qualities["UNMATCHED"],
        "overlap_assumption": OVERLAP_ASSUMPTION,
    }
    prepared = {"metadata": metadata, "markets": prepared_markets}
    report = {
        "format": "etoilys-releves-report-1", "metadata": metadata,
        "total_volume": total_volume, "usable_volume": total_volume - excluded_volume,
        "excluded_volume": excluded_volume, "quality_counts": dict(qualities),
        "method_counts": dict(methods), "warnings": warnings,
        "overlap_note": (
            "Les volumes de marchés distincts sont additionnés sur l'hypothèse métier "
            "d'annonces disjointes ; le JSON ne contient pas les annonces pour la vérifier."
        ),
    }
    return prepared, report


def write_new(path: Path, document: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8", newline="\n") as stream:
        json.dump(document, stream, ensure_ascii=False, sort_keys=True, indent=2)
        stream.write("\n")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("original", type=Path, help="Export JSON original inchangé")
    parser.add_argument("prepared", type=Path, help="Nouveau JSON préparé pour Java")
    parser.add_argument("report", type=Path, help="Nouveau rapport interne")
    parser.add_argument("--decisions", type=Path, help="Attestation et corrections par market_id")
    parser.add_argument("--reference", type=Path, default=REFERENCE_DIR, help="Référentiel 2026 figé")
    args = parser.parse_args()
    try:
        paths = [args.original.resolve(), args.prepared.resolve(), args.report.resolve()]
        if len(set(paths)) != 3 or args.prepared.exists() or args.report.exists():
            raise ValueError("L'original, le préparé et le rapport doivent être trois fichiers distincts ; les sorties doivent être nouvelles")
        prepared, report = prepare(args.original, args.decisions, args.reference)
        write_new(args.prepared, prepared)
        report["prepared_sha256"] = sha256(args.prepared)
        write_new(args.report, report)
        print(f"Préparé : {args.prepared} ({len(prepared['markets'])} marchés)")
        print(f"Rapport : {args.report} ({len(report['warnings'])} avertissements)")
        return 0
    except (OSError, ValueError) as error:
        parser.exit(1, f"Erreur : {error}\n")


if __name__ == "__main__":
    raise SystemExit(main())
