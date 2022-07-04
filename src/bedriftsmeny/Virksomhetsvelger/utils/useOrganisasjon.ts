import {useEffect, useState} from 'react';

import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from '../../organisasjon';
import {getLocalStorageOrgnr, hentUnderenheter, setLocalStorageOrgnr, settOrgnummerIUrl} from './utils';

const lookupOrg = (alle: Organisasjon[], orgnr: string | null): Organisasjon | undefined =>
    orgnr === null
        ? undefined
        : alle.find(({OrganizationNumber}) => OrganizationNumber === orgnr);

const useOrganisasjon = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[] = [],
) => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();

    const brukOrgnummerFraUrl = () => {
        if (organisasjonstre.length === 0) {
            return;
        }

        const orgnummerFraUrl = new URL(window.location.href).searchParams.get('bedrift');
        const orgnummerFraLocalStore = getLocalStorageOrgnr();
        const underenheter = hentUnderenheter(organisasjonstre);

        if (valgtOrganisasjon && valgtOrganisasjon.OrganizationNumber === orgnummerFraUrl) {
            setLocalStorageOrgnr(orgnummerFraUrl);
            return;
        }

        const organisasjonReferertIUrl = lookupOrg(underenheter, orgnummerFraUrl);

        if (organisasjonReferertIUrl !== undefined) {
            setValgtOrganisasjon(organisasjonReferertIUrl);
            setLocalStorageOrgnr(organisasjonReferertIUrl.OrganizationNumber);
            return;
        }

        if (valgtOrganisasjon && valgtOrganisasjon.OrganizationNumber === orgnummerFraLocalStore) {
            settOrgnummerIUrl(orgnummerFraLocalStore)
            return;
        }

        const organisasjonReferertILocalStore = lookupOrg(underenheter, orgnummerFraLocalStore);

        if (organisasjonReferertILocalStore !== undefined) {
            setValgtOrganisasjon(organisasjonReferertILocalStore);
            settOrgnummerIUrl(organisasjonReferertILocalStore.OrganizationNumber)
            return;
        }

        const førsteOrganisasjon = organisasjonstre[0].Underenheter[0];
        settOrgnummerIUrl(førsteOrganisasjon.OrganizationNumber);
        setLocalStorageOrgnr(førsteOrganisasjon.OrganizationNumber)
        setValgtOrganisasjon(førsteOrganisasjon);
    };

    useEffect(() => {
        brukOrgnummerFraUrl();

        const unlisten = history.listen(brukOrgnummerFraUrl);
        return unlisten;
    }, [organisasjonstre]);

    return { valgtOrganisasjon };
};

export default useOrganisasjon;
