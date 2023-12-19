import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from "../organisasjon";
import {useContext, useEffect, useReducer} from "react";
import {VirksomhetsvelgerContext} from "./VirksomhetsvelgerProvider";

export type OrganisasjonMedState = Organisasjon & {
    fokusert: boolean;
    valgt: boolean;
    ekspandert: boolean;
    erHovedEnhet: boolean;
}
type Action = {
    type: "FOKUSER_ENHET";
    payload: Organisasjon;
} | {
    type: "FOKUSER_FØRSTE_ENHET"
} | {
    type: "FOKUSER_SISTE_ENHET"
} | {
    type: "TOGGLE_EKSPANDER_ENHET";
    payload: Organisasjon;
} | {
    type: "RESET_STATE";
    payload: { aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[], valgtOrganisasjon: string };
}
const reducer = (state: OrganisasjonMedState[], action: Action): OrganisasjonMedState[] => {
    switch (action.type) {
        case "FOKUSER_ENHET":
            return state.map((org) => ({
                ...org,
                fokusert: org.OrganizationNumber === action.payload.OrganizationNumber,
            }));

        case "FOKUSER_FØRSTE_ENHET":
            return state.map((org, i) => ({
                ...org,
                fokusert: i === 0,
            }));

        case "FOKUSER_SISTE_ENHET":
            const lastIndex = state.findLastIndex((org) => org.erHovedEnhet || org.ekspandert);
            return state.map((org, i) => ({
                ...org,
                fokusert: i === lastIndex,
            }));

        case "TOGGLE_EKSPANDER_ENHET":
            return state.map((org) => ({
                ...org,
                ekspandert: (
                    org.OrganizationNumber === action.payload.OrganizationNumber
                    || org.ParentOrganizationNumber === action.payload.OrganizationNumber
                ) ? !org.ekspandert : org.ekspandert,
            }));

        case "RESET_STATE":
            return initState(action.payload);
    }
}

const initState = (
    {
        aktivtOrganisasjonstre,
        valgtOrganisasjon
    }: {
        aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
        valgtOrganisasjon: string
    }
): OrganisasjonMedState[] => {
    const valgtOrganisasjonErITre = aktivtOrganisasjonstre.some(({Underenheter}) => Underenheter.some(({OrganizationNumber}) => OrganizationNumber === valgtOrganisasjon));
    return aktivtOrganisasjonstre
        .flatMap(({JuridiskEnhet, Underenheter}, level) => [
            {
                ...JuridiskEnhet,
                ekspandert: Underenheter.some(({OrganizationNumber}) => OrganizationNumber === valgtOrganisasjon),
                erHovedEnhet: true,
                valgt: false,
                fokusert: false,
            }, ...Underenheter.map((Underenhet, i) => ({
                ...Underenhet,
                erHovedEnhet: false,
                fokusert: valgtOrganisasjonErITre ? Underenhet.OrganizationNumber === valgtOrganisasjon : level === 0 && i === 0,
                valgt: valgtOrganisasjonErITre ? Underenhet.OrganizationNumber === valgtOrganisasjon : level === 0 && i === 0,
                ekspandert: Underenheter.some(({OrganizationNumber}) => OrganizationNumber === valgtOrganisasjon)
            }))
        ]);
}


export type UseTastaturNavigasjon = {
    fokusertEnhet: OrganisasjonMedState,
    organisasjonerMedState: OrganisasjonMedState[],
    fokuserFørsteEnhet: () => void,
    fokuserSisteEnhet: () => void,
    pilOpp: () => void,
    pilNed: () => void,
    pilHøyre: () => void,
    pilVenstre: () => void,
    toggleEkspander: (enhet: Organisasjon) => void,
    fokuserEnhet: (enhet: Organisasjon) => void,
    resetState: () => void,
};
export const useTastaturNavigasjon = (): UseTastaturNavigasjon => {
    const {
        valgtOrganisasjon,
        aktivtOrganisasjonstre,
    } = useContext(VirksomhetsvelgerContext);
    const [organisasjonerMedState, dispatch] = useReducer(
        reducer,
        {aktivtOrganisasjonstre, valgtOrganisasjon: valgtOrganisasjon.OrganizationNumber},
        initState,
    );

    const resetState = () => {
        dispatch({
            type: "RESET_STATE",
            payload: {aktivtOrganisasjonstre, valgtOrganisasjon: valgtOrganisasjon.OrganizationNumber},
        })
    };

    useEffect(() => {
        // Reset state when the active tree changes
        resetState()
    }, [JSON.stringify(aktivtOrganisasjonstre), valgtOrganisasjon.OrganizationNumber]);
    const fokusertEnhet = organisasjonerMedState.find(({fokusert}) => fokusert) ?? (organisasjonerMedState.find(({valgt}) => valgt) ?? organisasjonerMedState[0] ?? valgtOrganisasjon);
    const fokusertIndex = organisasjonerMedState.findIndex(({OrganizationNumber}) => OrganizationNumber === fokusertEnhet.OrganizationNumber);

    const fokuserFørsteEnhet = () => {
        dispatch({type: 'FOKUSER_FØRSTE_ENHET'});
    };

    const fokuserSisteEnhet = () => {
        dispatch({type: 'FOKUSER_SISTE_ENHET'});
    };

    const pilOpp = () => {
        const nextEnhet = organisasjonerMedState.slice(0, fokusertIndex).findLast((org) => org.erHovedEnhet || org.ekspandert)
        if (nextEnhet !== undefined) {
            dispatch({type: "FOKUSER_ENHET", payload: nextEnhet})
        }
    };

    const pilNed = () => {
        const nextEnhet = organisasjonerMedState.slice(fokusertIndex + 1).find((org) => org.erHovedEnhet || org.ekspandert)
        if (nextEnhet !== undefined) {
            dispatch({type: "FOKUSER_ENHET", payload: nextEnhet})
        }
    };

    const pilHøyre = () => {
        if (fokusertEnhet.erHovedEnhet) {
            if (fokusertEnhet.ekspandert) {
                const nextEnhet = organisasjonerMedState[fokusertIndex + 1];
                if (nextEnhet !== undefined) {
                    dispatch({type: "FOKUSER_ENHET", payload: nextEnhet})
                }
            } else {
                dispatch({type: 'TOGGLE_EKSPANDER_ENHET', payload: fokusertEnhet})
            }
        }
    };

    const toggleEkspander = (enhet: Organisasjon) => {
        dispatch({type: 'TOGGLE_EKSPANDER_ENHET', payload: enhet})
    };

    const fokuserEnhet = (enhet: Organisasjon) => {
        dispatch({type: "FOKUSER_ENHET", payload: enhet})
    };

    const pilVenstre = () => {
        if (fokusertEnhet.erHovedEnhet) {
            if (fokusertEnhet.ekspandert) {
                toggleEkspander(fokusertEnhet);
            }
        } else {
            const nextEnhet = organisasjonerMedState.find(({OrganizationNumber}) => OrganizationNumber === fokusertEnhet.ParentOrganizationNumber);
            if (nextEnhet !== undefined) {
                fokuserEnhet(nextEnhet);
            }
        }
    };

    return {
        fokusertEnhet,
        organisasjonerMedState,
        fokuserFørsteEnhet,
        fokuserSisteEnhet,
        pilOpp,
        pilNed,
        pilHøyre,
        pilVenstre,
        toggleEkspander,
        fokuserEnhet,
        resetState,
    }
}