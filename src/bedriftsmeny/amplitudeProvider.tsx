import {AmplitudeClient} from "amplitude-js";
import React, {createContext, FunctionComponent} from 'react';

type Context = {
    loggBedriftValgt: (orgnr: string) => void;
}

interface Props {
    amplitudeClient?: AmplitudeClient
}

export const AmplitudeLoggerContext = createContext<Context>({} as Context);

export const AmplitudeProvider: FunctionComponent<Props> = (props) => {

    const loggBedriftValgt = (orgnr: string) => {
        if (props.amplitudeClient !== undefined) {
            props.amplitudeClient.logEvent("velgbedrift", orgnr)
        }
    }

    let defaultContext: Context = {
        loggBedriftValgt
    };

    return (
        <AmplitudeLoggerContext.Provider value={defaultContext}>
            {props.children}
        </AmplitudeLoggerContext.Provider>
    )
};