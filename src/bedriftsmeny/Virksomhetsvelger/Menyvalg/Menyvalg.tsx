import React, { FunctionComponent, useState } from 'react';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
    tomEnhetsregOrg
} from '../../organisasjon';
import { History } from 'history';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';

interface Props {
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    history: History;
    valgtOrganisasjon: Organisasjon;
    erSok: boolean;
}

const Menyvalg: FunctionComponent<Props> = (props) => {
    const { menyKomponenter = [], history, valgtOrganisasjon, setErApen, erSok, erApen } = props;
    const [juridiskEnhetTrykketPaa, setJuridiskEnhetTrykketPaa] = useState<string>('');
    const [hover, setHover] = useState(false);
    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(menyKomponenter[0].JuridiskEnhet);

    const utpakketMenyKomponenter: Organisasjon[] = [];
    menyKomponenter.forEach((enhet: JuridiskEnhetMedUnderEnheterArray) => {
        utpakketMenyKomponenter.push(enhet.JuridiskEnhet);
        enhet.Underenheter.forEach((underenhet => utpakketMenyKomponenter.push(underenhet)))
    })

    const finnIndeksIMenyKomponenter = (enhetsOrganisasjonsnummer: string, array: JuridiskEnhetMedUnderEnheterArray[]) =>  {
        console.log("prøver å finne indeks ikke-valgt juridisk enhet")
        const indeksTilEnhet =
            array.map(organisasjon => organisasjon.JuridiskEnhet.OrganizationNumber).indexOf(enhetsOrganisasjonsnummer);
        console.log("indeks", indeksTilEnhet, enhetsOrganisasjonsnummer)
        return indeksTilEnhet;
    }

    const finnIndeksIUtpakketListe = (organisasjonsnummer: string, array: Organisasjon[]) =>  {
        console.log("prøvwr å finne indeks")
        const indeksTilEnhet =
            array.map(organisasjon => organisasjon.OrganizationNumber).indexOf(organisasjonsnummer);
        console.log("indeks", indeksTilEnhet, organisasjonsnummer)
        return indeksTilEnhet;
    }

    const setNyOrganisasjonIFokus = (keyPressKey: string, erApen: boolean) => {
        if (keyPressKey !== 'ArrowDown' && keyPressKey !== 'ArrowUp') {
            return
        }
        let fantFokuset = false;
        const erJuridiskEnhet = organisasjonIFokus.Type === 'Enterprise' || organisasjonIFokus.OrganizationForm === 'FLI'
        let nesteOrganisasjon = tomAltinnOrganisasjon;
            if (keyPressKey === 'ArrowDown') {
                if (erApen || !erJuridiskEnhet) {
                    const indeksAvNåværendeOrganisasjon = finnIndeksIUtpakketListe( organisasjonIFokus.OrganizationNumber,utpakketMenyKomponenter,)
                    // @ts-ignore
                    nesteOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon + 1]
                    console.log("forrige fokus var: " + organisasjonIFokus.Name, erJuridiskEnhet, erApen)
                } else {
                    console.log("forsøker hoppe til langt fram")
                    const indeksAvNåværendeOrganisasjon = finnIndeksIMenyKomponenter(organisasjonIFokus.OrganizationNumber, menyKomponenter)
                    nesteOrganisasjon = menyKomponenter[indeksAvNåværendeOrganisasjon + 1].JuridiskEnhet
                }
            }
        if (keyPressKey === 'ArrowUp') {
            if (erApen || !erJuridiskEnhet) {
                const indeksAvNåværendeOrganisasjon = finnIndeksIUtpakketListe( organisasjonIFokus.OrganizationNumber,utpakketMenyKomponenter,)
                // @ts-ignore
                nesteOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon - 1]
                console.log("forsøker hoppe til nærmeste for indeks ", indeksAvNåværendeOrganisasjon)
            } else {
                console.log("forsøker hoppe til langt fram")
                const indeksAvNåværendeOrganisasjon = finnIndeksIMenyKomponenter(organisasjonIFokus.OrganizationNumber, menyKomponenter)
                nesteOrganisasjon = menyKomponenter[indeksAvNåværendeOrganisasjon - 1].JuridiskEnhet
            }

        }
        const idNesteelement = 'organisasjons-id-'+nesteOrganisasjon.OrganizationNumber;
        console.log("id til neste element: " +idNesteelement)
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
