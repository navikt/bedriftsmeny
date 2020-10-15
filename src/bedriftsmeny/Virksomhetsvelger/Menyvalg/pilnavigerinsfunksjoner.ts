import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../organisasjon';

export const finnIndeksIMenyKomponenter = (enhetsOrganisasjonsnummer: string, array: JuridiskEnhetMedUnderEnheterArray[]) =>  {
    const indeksTilEnhet =
        array.map(organisasjon => organisasjon.JuridiskEnhet.OrganizationNumber).indexOf(enhetsOrganisasjonsnummer);
    return indeksTilEnhet;
}

export const finnIndeksIUtpakketListe = (organisasjonsnummer: string, array: Organisasjon[]) =>  {
    const indeksTilEnhet =
        array.map(organisasjon => organisasjon.OrganizationNumber).indexOf(organisasjonsnummer);
    return indeksTilEnhet;
}

export const sjekkOmNederstPåLista = (
    erApenJuridiskEnhet: boolean,
    erJuridiskEnhet: boolean,
    organisasjon: Organisasjon,
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[],
    utpakketMenyKomponenter: Organisasjon[]) => {
    if (!erJuridiskEnhet) {
        const indeksTilOrganisasjon = finnIndeksIUtpakketListe(organisasjon.OrganizationNumber, utpakketMenyKomponenter);
        return indeksTilOrganisasjon === utpakketMenyKomponenter.length-1;
    }
    if (!erApenJuridiskEnhet) {
        const indeksTilOrganisasjon = finnIndeksIMenyKomponenter(organisasjon.OrganizationNumber, menyKomponenter);
        return indeksTilOrganisasjon === menyKomponenter.length-1;
    }
}