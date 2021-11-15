import React, { createContext, FunctionComponent } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../organisasjon';
import { History } from 'history';

interface Props {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

interface Context {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any)

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = props => {
    const context: Context = {
        history: props.history,
        organisasjonstre: props.organisasjonstre,
    }
    return <VirksomhetsvelgerContext.Provider value={context}>
        {props.children}
    </VirksomhetsvelgerContext.Provider>
};