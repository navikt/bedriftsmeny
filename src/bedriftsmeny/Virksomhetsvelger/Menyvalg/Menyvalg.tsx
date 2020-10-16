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
    finnIndeksIUtpakketListe,
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
    const [forrigeOrganisasjonIFokus, setForrigeOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (erApen) {
            if (!erSok) {
                const valgtOrganisasjonEnhetIndeks = finnIndeksIMenyKomponenter(valgtOrganisasjon.ParentOrganizationNumber, menyKomponenter)
                setOrganisasjonIFokus(menyKomponenter[valgtOrganisasjonEnhetIndeks].JuridiskEnhet);
            }
            else {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
            }
            setfokusPaSokefelt();
        }

    }, [erApen, valgtOrganisasjon, menyKomponenter]);

    useEffect(() => {
        setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet)
    }, []);

    useEffect(() => {
        const navarendeTabIndex = erApen ? 0 : -1
        endreTabIndexAlleOrganisasjonerOgSokefelt(menyKomponenter,navarendeTabIndex)
    }, [erApen, menyKomponenter]);

    const utpakketMenyKomponenter: Organisasjon[] = [];
    menyKomponenter.forEach((enhet: JuridiskEnhetMedUnderEnheterArray) => {
        utpakketMenyKomponenter.push(enhet.JuridiskEnhet);
        enhet.Underenheter.forEach((underenhet => utpakketMenyKomponenter.push(underenhet)))
    })

    const setNyOrganisasjonIFokus = (keyPressKey: string, erApen: boolean) => {
        setForrigeOrganisasjonIFokus(organisasjonIFokus);
        console.log("juridisk enhet er åpen: ",erApen)
        if (keyPressKey !== 'ArrowDown' && keyPressKey !== 'ArrowUp') {
            return
        }
        let fantFokuset = false;
        const erJuridiskEnhet = organisasjonIFokus.Type === 'Enterprise' || organisasjonIFokus.OrganizationForm === 'FLI'
        erJuridiskEnhet && console.log("juridisk enhet er åpen: ",erApen)
        let nesteOrganisasjon = tomAltinnOrganisasjon;
            if (keyPressKey === 'ArrowDown') {
                if (sjekkOmNederstPåLista(erApen,erJuridiskEnhet,organisasjonIFokus, menyKomponenter, utpakketMenyKomponenter)) {
                    nesteOrganisasjon = utpakketMenyKomponenter[0]
                }
                else if (erApen || !erJuridiskEnhet) {
                    const indeksAvNåværendeOrganisasjon = finnIndeksIUtpakketListe( organisasjonIFokus.OrganizationNumber,utpakketMenyKomponenter,)
                    nesteOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon + 1]
                } else {
                    const indeksAvNåværendeOrganisasjon = finnIndeksIMenyKomponenter(organisasjonIFokus.OrganizationNumber, menyKomponenter)
                    nesteOrganisasjon = menyKomponenter[indeksAvNåværendeOrganisasjon + 1].JuridiskEnhet
                }
            }
        if (keyPressKey === 'ArrowUp') {
            let indeksAvNåværendeOrganisasjon = finnIndeksIUtpakketListe( organisasjonIFokus.OrganizationNumber,utpakketMenyKomponenter)
            const erForsteElement = indeksAvNåværendeOrganisasjon === 0;
            if (erForsteElement) {
                setfokusPaSokefelt()
                return
            }
            if (erApen || !erJuridiskEnhet ||forrigeOrganisasjonIFokus.OrganizationForm === 'BEDR') {
                nesteOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon - 1]
            } else {
                indeksAvNåværendeOrganisasjon = finnIndeksIMenyKomponenter(organisasjonIFokus.OrganizationNumber, menyKomponenter)
                nesteOrganisasjon = menyKomponenter[indeksAvNåværendeOrganisasjon - 1].JuridiskEnhet
            }

        }
        const idNesteelement = 'organisasjons-id-'+nesteOrganisasjon.OrganizationNumber;
        const nesteElement = document.getElementById(idNesteelement);
        if (nesteElement) {
           nesteElement.focus();
           fantFokuset = true;
        }
        else {
            const nesteOrganisasjonErJuridiskEnhet = nesteOrganisasjon.Type === 'Enterprise' || nesteOrganisasjon.OrganizationForm === 'FLI'
            if (nesteOrganisasjonErJuridiskEnhet) {
                const elementValgtEnhet = document.getElementById('valgtjuridiskenhet')
                if (elementValgtEnhet) {
                    elementValgtEnhet.focus()
                    fantFokuset = true;
                }
            }
            else {
                const elementValgtEnhet = document.getElementById('valgtunderenhet')
                if (elementValgtEnhet) {
                    elementValgtEnhet.focus()
                    fantFokuset = true;
                }
            }
            if (fantFokuset) {
                setOrganisasjonIFokus(nesteOrganisasjon)
                return
            }
        }
        if (fantFokuset) {
            setOrganisasjonIFokus(nesteOrganisasjon)
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