import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../Organisasjon';
import Underenhet from './Underenhet/Underenhet';
import UnderenhetsVelgerMenyButton from './UnderenhetsVelgerMenyButton/UnderenhetsVelgerMenyButton';
import './Underenhetsvelger.less';

interface Props {
    history: History;
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    valgtOrganisasjon: Organisasjon;
    setErApen: (bool: boolean) => void;
    juridiskEnhetTrykketPaa: string;
    setJuridiskEnhetTrykketPaa: (juridiskenhet: string) => void;
    hover: boolean;
    setHover: (bool: boolean) => void;
}

const Underenhetsvelger: FunctionComponent<Props> = ({
    history,
    juridiskEnhetMedUnderenheter,
    valgtOrganisasjon,
    setErApen,
    juridiskEnhetTrykketPaa,
    setJuridiskEnhetTrykketPaa,
    hover,
    setHover
}) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);

    useEffect(() => {
        setVisUnderenheter(false);
        const erValgt = valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber;
        if (erValgt || juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber === juridiskEnhetTrykketPaa) {
            setVisUnderenheter(true);
        }
    }, [juridiskEnhetMedUnderenheter, valgtOrganisasjon, juridiskEnhetTrykketPaa]);

    return (
        <div className="underenhetsvelger">
            <UnderenhetsVelgerMenyButton
                visUnderenheter={visUnderenheter}
                juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter}
                valgtOrganisasjon={valgtOrganisasjon}
                setVisUnderenheter={setVisUnderenheter}
                setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                hover={hover}
                setHover={setHover}
            />
            <ul
                className="underenhetsvelger__menyvalg-wrapper"
                id={`underenhetvelger${juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber}`}
                role="menu"
                aria-label={`Velg underenhet til ${juridiskEnhetMedUnderenheter.JuridiskEnhet.Name}`}>
                {visUnderenheter &&
                    juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon) => (
                        <Underenhet
                            key={organisasjon.OrganizationNumber}
                            underEnhet={organisasjon}
                            valgtOrganisasjon={valgtOrganisasjon}
                            history={history}
                            setErApen={setErApen}
                            hover={hover}
                            setHover={setHover}
                        />
                    ))}
            </ul>
        </div>
    );
};

export default Underenhetsvelger;
