import React, {createContext, FunctionComponent, useEffect, useState} from 'react';
import {JuridiskEnhetMedUnderEnheterArray, Organisasjon, tomAltinnOrganisasjon} from '../organisasjon';
import useOrganisasjon from './utils/useOrganisasjon';
import {OrgnrSearchParamType, setLocalStorageOrgnr, useOrgnrSearchParam} from './utils/utils';
import {byggSokeresultat} from './utils/byggSokeresultat';

interface Props {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    orgnrSearchParam?: OrgnrSearchParamType;
}

interface Context {
    aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    velgUnderenhet: (orgnr: string) => void;
    valgtOrganisasjon: Organisasjon;

    setSøketekst: (søketekst: string) => void;
    søketekst: string;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any)

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = ({children, organisasjonstre, orgnrSearchParam}) => {
    const orgnrParamHook = orgnrSearchParam ?? useOrgnrSearchParam;
    const [søketekst, setSøketekst] = useState("");
    const [aktivtOrganisasjonstre, setAktivtOrganisasjonstre] = useState(organisasjonstre);
    const {valgtOrganisasjon} = useOrganisasjon(organisasjonstre, orgnrParamHook);
    const [, setOrgnr] = orgnrParamHook();

    useEffect(() => {
        setAktivtOrganisasjonstre(byggSokeresultat(organisasjonstre, søketekst));
    }, [organisasjonstre, søketekst])

    if (valgtOrganisasjon === undefined || valgtOrganisasjon === tomAltinnOrganisasjon) {
        return null;
    }

    const context: Context = {
        velgUnderenhet: (orgnr) => {
            setOrgnr(orgnr)
            setLocalStorageOrgnr(orgnr)
        },
        aktivtOrganisasjonstre,
        valgtOrganisasjon,
        søketekst,
        setSøketekst
    }

    return <VirksomhetsvelgerContext.Provider value={context}>
        {children}
    </VirksomhetsvelgerContext.Provider>

};