import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon, tomAltinnOrganisasjon } from '../organisasjon';
import useOrganisasjon from './utils/useOrganisasjon';
import { setLocalStorageOrgnr, settOrgnummerIUrl } from './utils/utils';
import { byggSokeresultat } from './utils/byggSokeresultat';

interface Props {
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
}

interface Context {
    aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    velgUnderenhet: (orgnr: string) => void;
    valgtOrganisasjon: Organisasjon;

    setSøketekst: (søketekst: string) => void;
    søketekst: string;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any)

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = props => {
    const [søketekst, setSøketekst] = useState('');
    const [aktivtOrganisasjonstre, setAktivtOrganisasjonstre] = useState(props.organisasjonstre)
    const { valgtOrganisasjon } = useOrganisasjon(props.organisasjonstre);

    useEffect(() => {
        setAktivtOrganisasjonstre(byggSokeresultat(props.organisasjonstre, søketekst));
    }, [props.organisasjonstre, søketekst])

    if (valgtOrganisasjon === undefined || valgtOrganisasjon === tomAltinnOrganisasjon) {
        return null;
    }

    const context: Context = {
        velgUnderenhet: (orgnr) => {
            settOrgnummerIUrl(orgnr)
            setLocalStorageOrgnr(orgnr)
        },
        aktivtOrganisasjonstre,
        valgtOrganisasjon,
        søketekst,
        setSøketekst
    }

    return <VirksomhetsvelgerContext.Provider value={context}>
        {props.children}
    </VirksomhetsvelgerContext.Provider>
};