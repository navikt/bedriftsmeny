import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../../organisasjon';
import { History } from 'history';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import {
    endreTabIndexAlleOrganisasjonerOgSokefelt,
    finnIndeksIMenyKomponenter,
    finnIndeksIUtpakketListe, finnOrganisasjonsSomskalHaFokus,
    setfokusPaSokefelt,
    sjekkOmNederstPåLista
} from './pilnavigerinsfunksjoner';

interface Props {
    valgtOrganisasjon: Organisasjon;
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    erSok: boolean;
    organisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    history: History;
}

const Menyvalg: FunctionComponent<Props> = (props) => {
    const { menyKomponenter = [], history, valgtOrganisasjon, setErApen, erSok, erApen, organisasjonIFokus, setOrganisasjonIFokus } = props;
    const [juridiskEnhetTrykketPaa, setJuridiskEnhetTrykketPaa] = useState<string>('');
    const [hover, setHover] = useState(false);

    useEffect(() => {
            if (!erSok) {
                const valgtOrganisasjonEnhetIndeks = finnIndeksIMenyKomponenter(valgtOrganisasjon.ParentOrganizationNumber, menyKomponenter)
                setOrganisasjonIFokus(menyKomponenter[valgtOrganisasjonEnhetIndeks].JuridiskEnhet);
                setJuridiskEnhetTrykketPaa(menyKomponenter[valgtOrganisasjonEnhetIndeks].JuridiskEnhet.OrganizationNumber)
            }
            else {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
                setErApen(true);
            }
            setfokusPaSokefelt();
    }, [erSok,valgtOrganisasjon, erApen]);

    useEffect(() => {
        setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet)
    }, []);

    useEffect(() => {
        const navarendeTabIndex = erApen ? 0 : -1
        endreTabIndexAlleOrganisasjonerOgSokefelt(menyKomponenter,navarendeTabIndex)
    }, [erApen, menyKomponenter]);

    const setNyOrganisasjonIFokus = (keypressKey: string, erApen: boolean) => {
        const organisasjonsSomSkalFåFokus =
            finnOrganisasjonsSomskalHaFokus(organisasjonIFokus,keypressKey, erApen,menyKomponenter,juridiskEnhetTrykketPaa);
        let organisasjonIFokusId = ''
        if (organisasjonsSomSkalFåFokus) {
            setOrganisasjonIFokus(organisasjonsSomSkalFåFokus);
            if (organisasjonsSomSkalFåFokus.OrganizationNumber === valgtOrganisasjon.OrganizationNumber) {
                organisasjonIFokusId = 'valgtunderenhet';
            }
            else if (organisasjonsSomSkalFåFokus.OrganizationNumber === valgtOrganisasjon.ParentOrganizationNumber) {
                organisasjonIFokusId = 'valgtjuridiskenhet'
            }
            else {
                organisasjonIFokusId = 'organisasjons-id-' + organisasjonsSomSkalFåFokus.OrganizationNumber;
            }
            const organisasjonsElement = document.getElementById(organisasjonIFokusId);
            organisasjonsElement && organisasjonsElement.focus();
        }

    }

    return (
        <div id = {"virksomhetsvelger-id"}>
            {menyKomponenter.map(organisasjon => (
                <Underenhetsvelger
                    setNyOrganisasjonIFokus = {setNyOrganisasjonIFokus}
                    key={organisasjon.JuridiskEnhet.OrganizationNumber}
                    juridiskEnhetMedUnderenheter={organisasjon}
                    history={history}
                    valgtOrganisasjon={valgtOrganisasjon}
                    erApen={erApen}
                    setErApen={setErApen}
                    juridiskEnhetTrykketPaa={juridiskEnhetTrykketPaa}
                    setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                    hover={hover}
                    setHover={setHover}
                    erSok={erSok}
                />
            ))}
        </div>
    );
};

export default Menyvalg;