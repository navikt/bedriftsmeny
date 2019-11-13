import fuzzysort from 'fuzzysort';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../Organisasjon';
import { hentUnderenheter } from '../utils';

const fuzzysortConfig = {
    key: 'Name',
    allowTypo: false,
    threshold: -1000
};

export function byggSokeresultat(
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[] = [],
    inputTekst: string
): JuridiskEnhetMedUnderEnheterArray[] {
    const sokeresultat = finnUnderEnheterMedSok(organisasjonstre, inputTekst);

    return matchResultatMedJuridiskEnhet(organisasjonstre, sokeresultat);
}

const finnUnderEnheterMedSok = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    inputTekst: string
) =>
    fuzzysort
        .go(inputTekst, hentUnderenheter(organisasjonstre), fuzzysortConfig)
        .map((underenhet: any) => underenhet.obj);

const matchResultatMedJuridiskEnhet = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    sokeresultat: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
    let sokeResultatListe: JuridiskEnhetMedUnderEnheterArray[] = [];

    organisasjonstre.forEach((juridiskEnhet) => {
        let listeMedUnderEnheterFraSokeResultat = juridiskEnhet.Underenheter.filter((underenhet) =>
            sokeresultat.includes(underenhet)
        );

        if (listeMedUnderEnheterFraSokeResultat.length > 0) {
            sokeResultatListe.push({
                JuridiskEnhet: juridiskEnhet.JuridiskEnhet,
                Underenheter: listeMedUnderEnheterFraSokeResultat
            });
        }
    });

    return sokeResultatListe;
};
