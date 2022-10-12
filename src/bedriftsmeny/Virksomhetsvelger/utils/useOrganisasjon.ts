import {useEffect, useState} from 'react';


import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from '../../organisasjon';
import {
    getLocalStorageOrgnr,
    hentUnderenheter, OrgnrSearchParamType,
    setLocalStorageOrgnr,
} from './utils';

const lookupOrg = (alle: Organisasjon[], orgnr: string | null): Organisasjon | undefined =>
    orgnr === null
        ? undefined
        : alle.find(({OrganizationNumber}) => OrganizationNumber === orgnr);

const useOrganisasjon = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[] = [], orgnrSearchParam: OrgnrSearchParamType) => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();
    const [orgnr, setOrgnr] = orgnrSearchParam();

    useEffect(() => {
        if (organisasjonstre.length === 0) {
            return;
        }

        const orgnummerFraLocalStore = getLocalStorageOrgnr();
        const underenheter = hentUnderenheter(organisasjonstre);

        if (valgtOrganisasjon && valgtOrganisasjon.OrganizationNumber === orgnr) {
            setLocalStorageOrgnr(orgnr);
            return;
        }

        const organisasjonReferertIUrl = lookupOrg(underenheter, orgnr);

        if (organisasjonReferertIUrl !== undefined) {
            setValgtOrganisasjon(organisasjonReferertIUrl);
            setLocalStorageOrgnr(organisasjonReferertIUrl.OrganizationNumber);
            return;
        }

        if (valgtOrganisasjon && valgtOrganisasjon.OrganizationNumber === orgnummerFraLocalStore) {
            setOrgnr(orgnummerFraLocalStore)
            return;
        }

        const organisasjonReferertILocalStore = lookupOrg(underenheter, orgnummerFraLocalStore);

        if (organisasjonReferertILocalStore !== undefined) {
            setValgtOrganisasjon(organisasjonReferertILocalStore);
            setOrgnr(organisasjonReferertILocalStore.OrganizationNumber)
            return;
        }
        const førsteOrganisasjon = organisasjonstre[0].Underenheter[0];
        setOrgnr(førsteOrganisasjon.OrganizationNumber);
        setLocalStorageOrgnr(førsteOrganisasjon.OrganizationNumber)
        setValgtOrganisasjon(førsteOrganisasjon);

    }, [organisasjonstre, orgnr]);

    return {valgtOrganisasjon};
};

export default useOrganisasjon;
