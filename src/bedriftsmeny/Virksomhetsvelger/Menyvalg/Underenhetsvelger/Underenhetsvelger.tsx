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
    setNyOrganisasjonIFokus: (KeypressKey: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
    lukkMenyOnTabPaNedersteElement: (organisasjonsnummer: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
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
    setNyOrganisasjonIFokus,
    setOrganisasjonIFokus,
    lukkMenyOnTabPaNedersteElement
}) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;

    useEffect(() => {
        setVisUnderenheter(false);
        const erValgt: boolean = valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;
        const bleTrykketPaaSist: boolean = juridiskEnhet.OrganizationNumber === juridiskEnhetTrykketPaa;

        if (!erApen) setJuridiskEnhetTrykketPaa('');

        if (
            (erValgt && juridiskEnhetTrykketPaa === '' && !erSok) ||
            (erValgt && bleTrykketPaaSist && !erSok) ||
            (erSok && juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet) ||
            bleTrykketPaaSist
        ) {
            setVisUnderenheter(true);
            const scrollcontainer = document.querySelector('.dropdownmeny-elementer');
            const valgtenhet = document.getElementById('underenhet-apen');
            const topPos = valgtenhet ? valgtenhet.offsetTop : 0;

            setTimeout(() => {
                if (valgtenhet && scrollcontainer && !erSok) {
                    scrollcontainer.scrollTop = topPos;
                }
            }, 100);
        }
    }, [juridiskEnhetMedUnderenheter, valgtOrganisasjon, juridiskEnhetTrykketPaa, erApen, visUnderenheter]);

    const lukkUnderenhetsvelgerOgFokuserPåEnhet = (underenhet: Organisasjon) => {
        const erUnderenhetAvValgtEnhet = underenhet.ParentOrganizationNumber === valgtOrganisasjon.ParentOrganizationNumber;
        const juridiskEnhetElementId = erUnderenhetAvValgtEnhet ? 'valgtjuridiskenhet' : 'organisasjons-id-' + underenhet.ParentOrganizationNumber;
        const juridiskEnhetElement = document.getElementById(juridiskEnhetElementId);
        if (juridiskEnhetElement) {
            juridiskEnhetElement && juridiskEnhetElement.click()
            juridiskEnhetElement && juridiskEnhetElement.focus()
            setOrganisasjonIFokus(juridiskEnhet)
        }
    }

    return (
        <div className="underenhetsvelger" id={visUnderenheter ? 'underenhet-apen' : ''}>
            <UnderenhetsVelgerMenyButton
                visUnderenheter={visUnderenheter}
                juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter}
                valgtOrganisasjon={valgtOrganisasjon}
                setVisUnderenheter={setVisUnderenheter}
                setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                setHover={setHover}
                erSok={erSok}
                erApen={erApen}
                setNyOrganisasjonIFokus = {setNyOrganisasjonIFokus}
                lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
            />
            <ul
                className={`underenhetsvelger__menyvalg-wrapper--${
                    visUnderenheter ? 'apen' : 'lukket'
                }`}
                id={`underenhetvelger${juridiskEnhet.OrganizationNumber}`}
                role="menu"
                aria-label={`Underenheter til ${juridiskEnhet.Name}`}
            >
                {juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon) => (
                    <Underenhet
                        lukkUnderenhetsvelgerOgFokuserPåEnhet={lukkUnderenhetsvelgerOgFokuserPåEnhet}
                        key={organisasjon.OrganizationNumber}
                        underEnhet={organisasjon}
                        valgtOrganisasjon={valgtOrganisasjon}
                        history={history}
                        setErApen={setErApen}
                        hover={hover}
                        setHover={setHover}
                        erApen={erApen}
                        setNyOrganisasjonIFokus = {setNyOrganisasjonIFokus}
                        lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Underenhetsvelger;