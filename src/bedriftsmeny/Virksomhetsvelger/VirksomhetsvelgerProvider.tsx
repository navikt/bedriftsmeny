import React, { createContext, FunctionComponent } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon, tomAltinnOrganisasjon } from '../organisasjon';
import { History } from 'history';
import useOrganisasjon from './utils/useOrganisasjon';
import { settOrgnummerIUrl } from './utils/utils';

interface Props {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

interface Context {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    velgUnderenhet: (orgnr: string) => void;
    valgtOrganisasjon: Organisasjon;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any)

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = props => {
    const { valgtOrganisasjon } = useOrganisasjon(props.organisasjonstre, props.history);

    if (valgtOrganisasjon === undefined || valgtOrganisasjon === tomAltinnOrganisasjon) {
        return null;
    }

    const context: Context = {
        velgUnderenhet: (orgnr) => settOrgnummerIUrl(orgnr, props.history),
        organisasjonstre: props.organisasjonstre,
        valgtOrganisasjon
    }

    return <VirksomhetsvelgerContext.Provider value={context}>
        {props.children}
    </VirksomhetsvelgerContext.Provider>
};