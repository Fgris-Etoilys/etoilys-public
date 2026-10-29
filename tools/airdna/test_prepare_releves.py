"""Tests du rapprochement 2026 depuis des exports locaux synthétiques."""

from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from prepare_releves import GeographicReference, prepare


def market(market_id: str, name: str, latitude: float, longitude: float, volume: int, old_code: str | None) -> dict:
    return {
        "market_id": market_id,
        "name": name,
        "country_code": "fr",
        "latitude": latitude,
        "longitude": longitude,
        "code_insee": old_code,
        "short_term_rental_listings_entire_place_ltm": volume,
    }


def original(markets: list[dict], complete: bool = True) -> dict:
    return {
        "metadata": {
            "generated_at": "2026-10-21T12:28:41.719848+00:00",
            "country_code": "fr",
            "count": len(markets),
            "raw_market_count": len(markets),
            "duplicate_market_count": 0,
            "filters": {"listing_type": "entire_place"},
            "metric": {
                "name": "short_term_rental_listings_entire_place_ltm",
                "source_field": "listing_count",
                "period": "trailing_12_months",
            },
            "collection_complete": complete,
            "collection_end": "short_page" if complete else "limit",
        },
        "markets": markets,
    }


class PrepareRelevesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.reference = GeographicReference()

    def test_homonymes_localites_et_scission_historique(self) -> None:
        ref = self.reference
        self.assertEqual(ref.point_code(2.439780028, 48.629610057), "91228")
        self.assertEqual(ref.candidates("Évry")["91228"], "historical")
        self.assertEqual(ref.candidates("Évry")["89162"], "current")
        self.assertEqual(ref.candidates("Lomme")["59350"], "locality")
        self.assertEqual(ref.candidates("Les Ulis")["91692"], "current")
        self.assertEqual(ref.point_code(2.943016571, 45.150200567), "15035")
        self.assertEqual(ref.candidates("Neussargues en Pinatelle")["15035"], "historical")
        self.assertEqual(ref.candidates("Neussargues en Pinatelle")["15141"], "historical")

    def test_preparation_et_correction_auditable(self) -> None:
        rows = [
            market("36172", "Évry", 48.629610057, 2.439780028, 12, "91228"),
            market("37986", "Les Ulis", 48.681137135, 2.184920232, 38, "91471"),
            market("36098", "Lomme", 50.642394389, 2.994224879, 0, "59350"),
            market("81988426", "Neussargues en Pinatelle", 45.150200567, 2.943016571, 6, "15035"),
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "original.json"
            path.write_text(json.dumps(original(rows), ensure_ascii=False), encoding="utf-8")
            prepared, report = prepare(path)
            by_id = {m["market_id"]: m for m in prepared["markets"]}
            self.assertEqual(by_id["36172"]["code_insee"], "91228")
            self.assertEqual(by_id["37986"]["code_insee"], "91692")
            self.assertEqual(by_id["36098"]["code_insee"], "59350")
            self.assertEqual(by_id["36098"]["volume"], 0)
            self.assertEqual(by_id["81988426"]["code_insee"], "15035")
            self.assertEqual(report["usable_volume"], 56)
            self.assertEqual(prepared["metadata"]["completeness"]["status"], "verified")
            self.assertEqual(prepared["metadata"]["unmatched_count"], 0)

            decisions = Path(directory) / "decisions.json"
            decisions.write_text(json.dumps({
                "original_sha256": hashlib.sha256(path.read_bytes()).hexdigest().upper(),
                "corrections": [{
                    "market_id": "37986",
                    "code_insee": "91471",
                    "operator": "ETOILYS-491",
                    "reason": "Test de correction",
                }],
            }, ensure_ascii=False), encoding="utf-8")
            corrected, corrected_report = prepare(path, decisions)
            corrected_row = next(m for m in corrected["markets"] if m["market_id"] == "37986")
            self.assertEqual(corrected_row["code_insee"], "91471")
            self.assertEqual(corrected_row["match_method"], "manual")
            self.assertEqual(corrected_row["correction"], {
                "operator": "ETOILYS-491", "reason": "Test de correction",
            })
            warning = next(w for w in corrected_report["warnings"] if w["market_id"] == "37986")
            self.assertIn("manual_override", warning["reasons"])
            self.assertEqual(warning["correction"]["reason"], "Test de correction")

    def test_collecte_incomplete_bloquee(self) -> None:
        rows = [market("1", "Lomme", 50.642394389, 2.994224879, 1, "59350")]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "incomplete.json"
            path.write_text(json.dumps(original(rows, complete=False)), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Collecte non terminée"):
                prepare(path)


    def test_marqueur_de_fin_de_collecte(self) -> None:
        from unittest.mock import patch
        from fetch_markets import fetch_all_markets

        raw = {"id": "1", "name": "Lomme", "country_code": "fr",
               "metrics": {"listing_count": 0}, "geospatial": {}}
        with patch("fetch_markets.get_app_token", return_value="factice"), patch(
            "fetch_markets.fetch_market_page", side_effect=[[raw], []]
        ):
            markets, pagination = fetch_all_markets(
                Path("session-inutilisée"), requested_page_size=1, request_delay=0, limit=None
            )
        self.assertEqual(len(markets), 1)
        self.assertTrue(pagination["collection_complete"])
        self.assertEqual(pagination["collection_end"], "empty_page")

        with patch("fetch_markets.get_app_token", return_value="factice"), patch(
            "fetch_markets.fetch_market_page", return_value=[raw]
        ):
            _, limited = fetch_all_markets(
                Path("session-inutilisée"), requested_page_size=1, request_delay=0, limit=1
            )
        self.assertFalse(limited["collection_complete"])
        self.assertEqual(limited["collection_end"], "limit")

if __name__ == "__main__":
    unittest.main()
