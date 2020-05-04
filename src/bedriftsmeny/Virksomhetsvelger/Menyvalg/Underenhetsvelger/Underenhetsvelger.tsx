import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
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
    erSok: boolean;
    erApen: boolean;
}

const Underenhetsvelger: FunctionComponent<Props> = ({
    history,
    juridiskEnhetMedUnderenheter,
    valgtOrganisasjon,
    juridiskEnhetTrykketPaa,
    setJuridiskEnhetTrykketPaa,
    hover,
    setHover,
    erSok,
    erApen,
    setErApen,
}) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;

    useEffect(() => {
        setVisUnderenheter(false);
        const erValgt: boolean =
            valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;
        const bleTrykketPaaSist: boolean = juridiskEnhet.OrganizationNumber === juridiskEnhetTrykketPaa;

        if (!erApen) setJuridiskEnhetTrykketPaa('');

        if (
            (erValgt && juridiskEnhetTrykketPaa === '' && !erSok) ||
            (erValgt && juridiskEnhet.OrganizationNumber === juridiskEnhetTrykketPaa && !erSok) ||
            (erSok && juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet) ||
            bleTrykketPaaSist
        ) {
            setVisUnderenheter(true);
            const openPanel = document.querySelector('.underenhetsvelger__button.juridiskenhet--apen');
            if (openPanel && !erSok) {
                setTimeout(() => {
                    openPanel.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 600);
            }
        }
    }, [juridiskEnhetMedUnderenheter, valgtOrganisasjon, juridiskEnhetTrykketPaa, erApen]);

    return (
        <div className="underenhetsvelger">
            <UnderenhetsVelgerMenyButton
                visUnderenheter={visUnderenheter}
                juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter}
                valgtOrganisasjon={valgtOrganisasjon}
                setVisUnderenheter={setVisUnderenheter}
                setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                setHover={setHover}
                erSok={erSok}
            />
            <ul
                className={`underenhetsvelger__menyvalg-wrapper--${
                    visUnderenheter ? 'apen' : 'lukket'
                }`}
                id={`underenhetvelger${juridiskEnhet.OrganizationNumber}`}
                role="menu"
                aria-label={`Velg underenhet til ${juridiskEnhet.Name}`}>
                {juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon) => (
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
