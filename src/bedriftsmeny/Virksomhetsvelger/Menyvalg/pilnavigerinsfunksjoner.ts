import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../../organisasjon';

export const finnOrganisasjonsSomskalHaFokus = (
    organisasjonIFokus: Organisasjon,
    keyPressKey: string,
    erApen: boolean,
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[],
    juridiskenhetTrykketPa: string): Organisasjon|null => {
    if (keyPressKey !== 'ArrowDown' && keyPressKey !== 'ArrowUp') {
        return null
    }
    const flatOrganisasjonsliste = pakkUtOrganisasjonstre(menyKomponenter);
    const erJuridiskEnhet = organisasjonIFokus.Type === 'Enterprise' || organisasjonIFokus.OrganizationForm === 'FLI'
    let nesteOrganisasjon = tomAltinnOrganisasjon;
    if (sjekkOmNederstPåLista(erApen, erJuridiskEnhet, organisasjonIFokus, menyKomponenter, flatOrganisasjonsliste) && keyPressKey === 'ArrowDown') {
        nesteOrganisasjon = flatOrganisasjonsliste[0];
        return nesteOrganisasjon;
    }
    if (sjekkOmOverstPaLista(organisasjonIFokus, flatOrganisasjonsliste) && keyPressKey === 'ArrowUp') {
        setfokusPaSokefelt();
        return null;
    }
    const indeksTilOrganisasjonIFlatListe = finnIndeksIUtpakketListe(organisasjonIFokus.OrganizationNumber, flatOrganisasjonsliste);
    if (!erJuridiskEnhet) {
        if (keyPressKey === 'ArrowDown') {
            nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe + 1];
        }
        if (keyPressKey === 'ArrowUp') {
            nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe - 1];
        }
    } else {
        const indeksTilOrganisasjonOrganisasjonstre = finnIndeksIMenyKomponenter(organisasjonIFokus.OrganizationNumber, menyKomponenter);
        if (keyPressKey === 'ArrowDown') {
            if (erApen) {
                nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe + 1]
            } else {
                nesteOrganisasjon = menyKomponenter[indeksTilOrganisasjonOrganisasjonstre + 1].JuridiskEnhet;
            }
        }
        if (keyPressKey === 'ArrowUp') {
            const juridiskEnhetOver = menyKomponenter[indeksTilOrganisasjonOrganisasjonstre - 1].JuridiskEnhet
            const juridiskEnhetOverErApen = juridiskEnhetOver.OrganizationNumber === juridiskenhetTrykketPa;
            if (juridiskEnhetOverErApen) {
                nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe - 1]
            } else {
                nesteOrganisasjon = juridiskEnhetOver
            }
        }
    }
    return nesteOrganisasjon;
}

const pakkUtOrganisasjonstre = (organisasjonstre: JuridiskEnhetMedUnderEnheterArray[]) => {
    const utpakketMenyKomponenter: Organisasjon[] = [];
    organisasjonstre.forEach((enhet: JuridiskEnhetMedUnderEnheterArray) => {
        utpakketMenyKomponenter.push(enhet.JuridiskEnhet);
        enhet.Underenheter.forEach((underenhet => utpakketMenyKomponenter.push(underenhet)))
    })
    return utpakketMenyKomponenter;
}

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

const sjekkOmOverstPaLista = (organisasjon: Organisasjon, organisasjoner: Organisasjon[]) => {
    return organisasjon.OrganizationNumber === organisasjoner[0].OrganizationNumber
}

export const endreTabIndexAlleOrganisasjonerOgSokefelt = (menyKomponenter: JuridiskEnhetMedUnderEnheterArray[], tabIndex: number) => {
    endreTabIndeksGittId("bedriftsmeny-sokefelt", tabIndex)
    endreTabIndeksGittId('valgtjuridiskenhet', tabIndex)
    endreTabIndeksGittId('valgtunderenhet', tabIndex)
    menyKomponenter.forEach((juridiskEnhetMedUnderenheter) => {
        endreTabIndeksGittId('organisasjons-id-'+juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber, tabIndex);
        juridiskEnhetMedUnderenheter.Underenheter.forEach(underenhet => endreTabIndeksGittId('organisasjons-id-'+underenhet.OrganizationNumber, tabIndex))
    })
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
    const hovedknapp = document.getElementById("virksomhetsvelger__button")
    hovedknapp && hovedknapp.focus();
}