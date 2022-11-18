import React, { createContext, FunctionComponent, ReactNode, useEffect, useState } from 'react';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
} from '../organisasjon';
import useOrganisasjon from './useOrganisasjon';
import { OrgnrSearchParamType, setLocalStorageOrgnr, useOrgnrSearchParam } from './utils';
import { byggSokeresultat } from './byggSokeresultat';

interface Props {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    orgnrSearchParam?: OrgnrSearchParamType;
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
    children?: ReactNode;
}

interface Context {
    aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    velgUnderenhet: (orgnr: string) => void;
    valgtOrganisasjon: Organisasjon;

    setSøketekst: (søketekst: string) => void;
    søketekst: string;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any);

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = ({
    children,
    organisasjonstre,
    orgnrSearchParam,
    onOrganisasjonChange,
}) => {
    const orgnrParamHook = orgnrSearchParam ?? useOrgnrSearchParam;
    const [søketekst, setSøketekst] = useState('');
    const [aktivtOrganisasjonstre, setAktivtOrganisasjonstre] = useState(organisasjonstre);
    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, orgnrParamHook);
    const [, setOrgnr] = orgnrParamHook();

    useEffect(() => {
        setAktivtOrganisasjonstre(byggSokeresultat(organisasjonstre, søketekst));
    }, [organisasjonstre, søketekst]);

    useEffect(() => {
        if (valgtOrganisasjon?.OrganizationNumber) {
            onOrganisasjonChange(valgtOrganisasjon)
        }
    }, [valgtOrganisasjon?.OrganizationNumber])

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const context: Context = {
        velgUnderenhet: (orgnr) => {
            setOrgnr(orgnr);
            setLocalStorageOrgnr(orgnr);
        },
        aktivtOrganisasjonstre,
        valgtOrganisasjon,
        søketekst,
        setSøketekst,
    };

    return (
        <VirksomhetsvelgerContext.Provider value={context}>
            {children}
        </VirksomhetsvelgerContext.Provider>
    );
};
