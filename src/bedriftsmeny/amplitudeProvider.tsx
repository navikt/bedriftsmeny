import {AmplitudeClient} from "amplitude-js";
import React, {createContext, FunctionComponent, ReactNode} from 'react';

type Context = {
    loggBedriftValgt: () => void;
}

interface Props {
    amplitudeClient?: AmplitudeClient;
    children?: ReactNode;
}

export const AmplitudeLoggerContext = createContext<Context>({} as Context);

const getLimitedUrl = () => {
    const {origin, pathname } = window.location;
    return `${origin}/${pathname.split('/')[1]}`;
}

export const AmplitudeProvider: FunctionComponent<Props> = (props) => {

    const loggBedriftValgt = () => {
        if (props.amplitudeClient !== undefined) {
            props.amplitudeClient.logEvent("virksomhetsklikk", {
                url: getLimitedUrl(),
            })
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