import { JuridiskEnhetMedUnderEnheterArray, ListeMedJuridiskeEnheter, Organisasjon } from '../../organisasjon';

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

export const endreTabIndexAlleOrganisasjonerOgSokefelt = (menyKomponenter: JuridiskEnhetMedUnderEnheterArray[], tabIndex: number) => {
    endreTabIndeksGittId("bedriftsmeny-sokefelt", tabIndex)
    endreTabIndeksGittId('valgtjuridiskenhet', tabIndex)
    endreTabIndeksGittId('valgtunderenhet', tabIndex)
    menyKomponenter.forEach((juridiskEnhetMedUnderenheter) => {
        endreTabIndeksGittId('organisasjons-id-'+juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber, tabIndex);
        juridiskEnhetMedUnderenheter.Underenheter.forEach(underenhet => endreTabIndeksGittId('organisasjons-id-'+underenhet.OrganizationNumber, tabIndex))
    })
    console.log("endrer indekser til", tabIndex)
}

export const endreTabIndeksGittId = (idString: string, tabIndex: number) => {
    const element = document.getElementById(idString);
    if (element) {
        element.tabIndex = tabIndex
    }
}

export const setfokusPaSokefelt = () => {
    const sokefeltElement = document.getElementById("bedriftsmeny-sokefelt")
    sokefeltElement && sokefeltElement.focus();
}

export const setfokusPaMenyKnapp = () => {
    console.log("prøver sette fokus på hovedknapp")
    const hovedknapp = document.getElementById("virksomhetsvelger__button")
    hovedknapp && console.log("fant knapp");
    hovedknapp && hovedknapp.focus();
}