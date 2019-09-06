import { History } from 'history';
import { Organisasjon } from '../Organisasjon';
import { useState, useEffect } from 'react';
import { settOrgnummerIUrl } from './utils';

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

const useOrganisasjon = (
    organisasjoner: Organisasjon[],
    lukkMeny: () => void,
    history: History
) => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();

    const brukOrgnummerFraUrl = () => {
        if (organisasjoner.length > 0) {
            let nesteValgteOrganisasjon;
            const orgnummerFraUrl = hentOrgnummerFraUrl();

            if (orgnummerFraUrl) {
                const orgnummerErUendret =
                    valgtOrganisasjon && orgnummerFraUrl === valgtOrganisasjon.OrganizationNumber;

                if (orgnummerErUendret) {
                    return;
                }

                const organisasjonReferertIUrl = organisasjoner.find(
                    (org) => org.OrganizationNumber === orgnummerFraUrl
                );

                if (organisasjonReferertIUrl) {
                    nesteValgteOrganisasjon = organisasjonReferertIUrl;
                } else {
                    nesteValgteOrganisasjon = organisasjoner[0];
                    settOrgnummerIUrl(organisasjoner[0].OrganizationNumber, history);
                }
            } else {
                nesteValgteOrganisasjon = organisasjoner[0];
                settOrgnummerIUrl(organisasjoner[0].OrganizationNumber, history);
            }

            lukkMeny();
            setValgtOrganisasjon(nesteValgteOrganisasjon);
        }
    };

    useEffect(() => {
        brukOrgnummerFraUrl();
        const unlisten = history.listen(brukOrgnummerFraUrl);
        return unlisten;
    }, [organisasjoner]);

    return { valgtOrganisasjon };
};

export default useOrganisasjon;
