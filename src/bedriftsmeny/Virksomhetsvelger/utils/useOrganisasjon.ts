import { History } from 'history';
import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from '../../organisasjon';
import { useState, useEffect } from 'react';
import { settOrgnummerIUrl, hentUnderenheter } from './utils';

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

const useOrganisasjon = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[] = [],
    history: History
) => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();

    const velgOrganisasjon = (organisasjon: Organisasjon, settOgsåOrgnummer?: boolean) => {
        if (settOgsåOrgnummer) {
            settOrgnummerIUrl(organisasjon.OrganizationNumber, history);
        }

        setValgtOrganisasjon(organisasjon);
    };

    const velgFørsteOrganisasjonSomFallback = () => {
        const førsteOrganisasjon = organisasjonstre[0].Underenheter[0];
        velgOrganisasjon(førsteOrganisasjon, true);
    };

    const velgOrganisasjonMedUrl = (orgnummerFraUrl: string) => {
        const underenheter = hentUnderenheter(organisasjonstre);
        const organisasjonReferertIUrl = underenheter.find(
            (org) => org.OrganizationNumber === orgnummerFraUrl
        );

        if (organisasjonReferertIUrl) {
            velgOrganisasjon(organisasjonReferertIUrl);
        } else {
            velgFørsteOrganisasjonSomFallback();
        }
    };

    const brukOrgnummerFraUrl = () => {
        if (organisasjonstre.length > 0) {
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

    useEffect(velgOrganisasjonOgLyttPåUrl, [organisasjonstre]);

    return { valgtOrganisasjon };
};

export default useOrganisasjon;
