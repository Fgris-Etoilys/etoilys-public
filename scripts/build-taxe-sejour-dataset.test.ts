import { describe, expect, it } from 'vitest';
import { buildCompactDatasetFromXml } from './build-taxe-sejour-dataset';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<delta>
  <version>2.5.0</version>
  <date>01/01/2026</date>
  <deliberations>
    <deliberation>
      <saisie>
        <collectiviteDeliberante siren="200000001">
          <nom>CC TEST</nom>
          <departement>
            <numero>33</numero>
          </departement>
        </collectiviteDeliberante>
      </saisie>
      <date>10/01/2026</date>
      <taxeAdditionnelleDepartementale>true</taxeAdditionnelleDepartementale>
      <taxeAdditionnelleRegionale>false</taxeAdditionnelleRegionale>
      <taxeAdditionnelleLGV>true</taxeAdditionnelleLGV>
      <taxeAdditionnelleArticleL2531-18>false</taxeAdditionnelleArticleL2531-18>
      <collectivites>
        <collectivite>
          <nom>VILLE A</nom>
          <codeInsee>33001</codeInsee>
        </collectivite>
      </collectivites>
      <regimes>
        <regime natureId="4">Forfaitaire</regime>
        <regime natureId="10">Réel</regime>
      </regimes>
      <periodes>
        <periode>
          <dateDebut>01 janvier</dateDebut>
          <dateFin>31 mars</dateFin>
          <tarifs>
            <tarif categorieId="2">1.20</tarif>
            <tarif categorieId="3">1.00</tarif>
            <tarif categorieId="4">0.80</tarif>
            <tarif categorieId="5">0.60</tarif>
            <tarif categorieId="6">0.40</tarif>
            <tarif categorieId="9">5.00</tarif>
          </tarifs>
        </periode>
        <periode>
          <dateDebut>01 avril</dateDebut>
          <dateFin>31 décembre</dateFin>
          <tarifs>
            <tarif categorieId="2">2.00</tarif>
            <tarif categorieId="3">1.60</tarif>
            <tarif categorieId="4">1.20</tarif>
            <tarif categorieId="5">0.80</tarif>
            <tarif categorieId="6">0.50</tarif>
            <tarif categorieId="9">3.00</tarif>
          </tarifs>
        </periode>
      </periodes>
      <abattements>
        <abattement>
          <taux>20.00</taux>
          <nuiteMin>1</nuiteMin>
          <nuiteMax>39</nuiteMax>
        </abattement>
      </abattements>
    </deliberation>
    <deliberation>
      <saisie>
        <collectiviteDeliberante siren="217500016">
          <nom>VILLE DE PARIS</nom>
          <codeInsee>75056</codeInsee>
          <departement>
            <numero>75</numero>
          </departement>
        </collectiviteDeliberante>
      </saisie>
      <date>03/06/2025</date>
      <taxeAdditionnelleDepartementale>false</taxeAdditionnelleDepartementale>
      <taxeAdditionnelleRegionale>true</taxeAdditionnelleRegionale>
      <taxeAdditionnelleLGV>false</taxeAdditionnelleLGV>
      <taxeAdditionnelleArticleL2531-18>true</taxeAdditionnelleArticleL2531-18>
      <regimes>
        <regime natureId="4">Réel</regime>
        <regime natureId="10">Réel</regime>
      </regimes>
      <periodes>
        <periode>
          <dateDebut>01 janvier</dateDebut>
          <dateFin>31 décembre</dateFin>
          <tarifs>
            <tarif categorieId="2">3.60</tarif>
            <tarif categorieId="3">2.60</tarif>
            <tarif categorieId="4">1.70</tarif>
            <tarif categorieId="5">1.00</tarif>
            <tarif categorieId="6">0.80</tarif>
            <tarif categorieId="9">5.00</tarif>
          </tarifs>
        </periode>
      </periodes>
      <abattements />
    </deliberation>
  </deliberations>
</delta>`;

describe('buildCompactDatasetFromXml', () => {
  it('extracts distinct classified and unclassified regimes, periods and abatements', () => {
    const dataset = buildCompactDatasetFromXml(SAMPLE_XML, '2026-01-01T00:00:00.000Z');
    const cityA = dataset.c.find((city) => city[0] === '33001');

    expect(cityA).toBeDefined();
    expect(cityA?.[3]).toBe('f');
    expect(cityA?.[4]).toBe('r');
    expect(cityA?.[5]).toBe(5);
    expect(cityA?.[6]).toHaveLength(2);
    expect(cityA?.[7]).toEqual([[20, 1, 39]]);
    expect(dataset.g).toBe('2026-01-01T00:00:00.000Z');
  });

  it('includes collectiviteDeliberante codeInsee entries when collectivites is absent', () => {
    const dataset = buildCompactDatasetFromXml(SAMPLE_XML, '2026-01-01T00:00:00.000Z');
    const paris = dataset.c.find((city) => city[0] === '75056');

    expect(paris).toBeDefined();
    expect(paris?.[1]).toBe('VILLE DE PARIS (75)');
    expect(paris?.[3]).toBe('r');
    expect(paris?.[4]).toBe('r');
  });
});
