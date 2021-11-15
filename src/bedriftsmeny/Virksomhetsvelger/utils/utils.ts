import { History } from 'history';

import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from '../../organisasjon';

const ORGNUMMER_PARAMETER = 'bedrift';

export const settOrgnummerIUrl = (orgnummer: string, history: History) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(ORGNUMMER_PARAMETER, orgnummer);

    const { search } = currentUrl;
    history.replace({ ...history.location, search });
};

export const getLocalStorageOrgnr = (): string | null =>
    window.localStorage.getItem(ORGNUMMER_PARAMETER);

export const setLocalStorageOrgnr = (orgnr: string): void =>
    window.localStorage.setItem(ORGNUMMER_PARAMETER, orgnr);

export const hentUnderenheter = (organisasjonstre: JuridiskEnhetMedUnderEnheterArray[]) =>
    organisasjonstre.reduce(
        (organisasjoner: Organisasjon[], parentOrg) => [
            ...organisasjoner,
            ...parentOrg.Underenheter
        ],
        []
    );
