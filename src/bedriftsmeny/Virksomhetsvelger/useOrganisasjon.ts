import { History } from 'history';
import { Organisasjon } from '../Organisasjon';
import { useState, useEffect } from 'react';
import { settOrgnummerIUrl } from './utils';

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

const useOrganisasjon = (organisasjoner: Organisasjon[], history: History) => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();

    const velgOrganisasjon = (organisasjon: Organisasjon, settOgsåOrgnummer?: boolean) => {
        if (settOgsåOrgnummer) {
            settOrgnummerIUrl(organisasjon.OrganizationNumber, history);
        }

        setValgtOrganisasjon(organisasjon);
    };

    const velgFørsteOrganisasjonSomFallback = () => {
        velgOrganisasjon(organisasjoner[0], true);
    };

    const velgOrganisasjonMedUrl = (orgnummerFraUrl: string) => {
        const organisasjonReferertIUrl = organisasjoner.find(
            (org) => org.OrganizationNumber === orgnummerFraUrl
        );

        if (organisasjonReferertIUrl) {
            velgOrganisasjon(organisasjonReferertIUrl);
        } else {
            velgFørsteOrganisasjonSomFallback();
        }
    };

    const brukOrgnummerFraUrl = () => {
        if (organisasjoner.length > 0) {
            const orgnummerFraUrl = hentOrgnummerFraUrl();

            if (valgtOrganisasjon) {
                if (valgtOrganisasjon.OrganizationNumber === orgnummerFraUrl) {
                    return;
                }
            }

            if (orgnummerFraUrl) {
                velgOrganisasjonMedUrl(orgnummerFraUrl);
            } else {
                velgFørsteOrganisasjonSomFallback();
            }
        }
    };

    const velgOrganisasjonOgLyttPåUrl = () => {
        brukOrgnummerFraUrl();
        const unlisten = history.listen(brukOrgnummerFraUrl);
        return unlisten;
    };

    useEffect(velgOrganisasjonOgLyttPåUrl, [organisasjoner]);

    return { valgtOrganisasjon };
};

export default useOrganisasjon;
