import React, { FunctionComponent, useState } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../organisasjon';
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
    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(valgtOrganisasjon);

    const utpakketMenyKomponenter: Organisasjon[] = [];
    menyKomponenter.forEach((enhet: JuridiskEnhetMedUnderEnheterArray) => {
        utpakketMenyKomponenter.push(enhet.JuridiskEnhet);
        enhet.Underenheter.forEach((underenhet => utpakketMenyKomponenter.push(underenhet)))
    })

    const setNyOrganisasjonIFokus = (keyPressKey: string) => {
        const indeksAvNåværendeOrganisasjon =
            utpakketMenyKomponenter.findIndex(organisasjon => organisasjon.OrganizationNumber === organisasjonIFokus.OrganizationNumber);
        if (keyPressKey === 'ArrowDown') {
            const nesteOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon+1]
            setOrganisasjonIFokus(nesteOrganisasjon)
            const prefiksOrganisasjonsId = nesteOrganisasjon.Type === 'Enterprise' ? 'enhet' : 'underenhet'
            const idNesteelement = prefiksOrganisasjonsId + '-' + nesteOrganisasjon.OrganizationNumber;
            const nesteElement = document.getElementById(idNesteelement);
            nesteElement && nesteElement.focus();
        }
        if (keyPressKey === 'ArrowUp') {
            const forrigeOrganisasjon = utpakketMenyKomponenter[indeksAvNåværendeOrganisasjon-1]
            setOrganisasjonIFokus(forrigeOrganisasjon)
            const prefiksOrganisasjonsId = forrigeOrganisasjon.Type === 'Enterprise' ? 'enhet' : 'underenhet'
            const idForrigeelement = prefiksOrganisasjonsId + '-' + forrigeOrganisasjon.OrganizationNumber;
            const forrigeElement = document.getElementById(idForrigeelement);
            forrigeElement && forrigeElement.focus();
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
