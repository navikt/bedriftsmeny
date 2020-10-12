import React, { forwardRef, FunctionComponent, RefObject, useEffect, useState } from 'react';
import { History } from 'history';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import Underenhet from './Underenhet/Underenhet';
import UnderenhetsVelgerMenyButton from './UnderenhetsVelgerMenyButton/UnderenhetsVelgerMenyButton';
import { useRoveFocus } from '../../useRoveFocus';
import './Underenhetsvelger.less';

interface Props {
    history: History;
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    valgtOrganisasjon: Organisasjon;
    setErApen: (bool: boolean) => void;
    juridiskEnhetTrykketPaa: string;
    setJuridiskEnhetTrykketPaa: (juridiskenhet: string) => void;
    hover: boolean;
    setHover: (bool: boolean) => void;
    erSok: boolean;
    erApen: boolean;
    index: number;
    dropdownref: () => HTMLDivElement|null;
}

const Underenhetsvelger = ({
    history,
    juridiskEnhetMedUnderenheter,
    valgtOrganisasjon,
    menyKomponenter,
    juridiskEnhetTrykketPaa,
    setJuridiskEnhetTrykketPaa,
    hover,
    setHover,
    erSok,
    erApen,
    setErApen,
    index,
    dropdownref
}: Props) => {
    const dropdownnode = dropdownref();
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const [antallUnderenheter, setAntallUnderenheter] = useState(0);
    const [currentFocusJuridiskEnhet, setFocusJuridiskEnhet, trykketHoyrePilIndex, setTrykketHoyrepilIndex, trykketHoyrePil, setTrykketHoyrepil, focusUnderenhet, setFocusUnderenhet, trykketNedIndex, setTrykketNed] = useRoveFocus(dropdownnode, antallUnderenheter, menyKomponenter);
    // || (valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber && juridiskEnhetTrykketPaa === '')
    useEffect(() => {
        setVisUnderenheter(false);
        const erValgt: boolean = valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;
        // @ts-ignore
        const bleTrykketPaaSist: boolean = juridiskEnhet.OrganizationNumber === juridiskEnhetTrykketPaa || (trykketHoyrePilIndex === index && trykketHoyrePil);

        if (!erApen) {
            setJuridiskEnhetTrykketPaa('');
            setFocusJuridiskEnhet(0);
            setTrykketHoyrepilIndex(-1);
            setTrykketHoyrepil(false);
            setFocusUnderenhet(0);
            setTrykketNed(-1);
        }

        if (
            (erValgt && juridiskEnhetTrykketPaa === '' && !erSok) ||
            (erValgt && bleTrykketPaaSist && !erSok) ||
            (erSok && juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet) ||
            bleTrykketPaaSist
        ) {
            setAntallUnderenheter(juridiskEnhetMedUnderenheter.Underenheter.length);
            setVisUnderenheter(true);
            // setCurrentFocusUnderenhet(0);

            const scrollcontainer = document.querySelector('.dropdownmeny-elementer');
            const valgtenhet = document.getElementById('underenhet-apen');
            const topPos = valgtenhet ? valgtenhet.offsetTop : 0;

            setTimeout(() => {
                if (valgtenhet && scrollcontainer && !erSok) {
                    scrollcontainer.scrollTop = topPos;
                }
            }, 100);
        }
    }, [juridiskEnhetMedUnderenheter, valgtOrganisasjon, index, juridiskEnhetTrykketPaa, erApen, visUnderenheter, trykketHoyrePil, trykketHoyrePilIndex, trykketNedIndex]);

    return (
        <li
            className="underenhetsvelger"
            id={visUnderenheter ? 'underenhet-apen' : ''}
            tabIndex={-1}
        >
            <UnderenhetsVelgerMenyButton
                visUnderenheter={visUnderenheter}
                juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter}
                valgtOrganisasjon={valgtOrganisasjon}
                setVisUnderenheter={setVisUnderenheter}
                setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                setHover={setHover}
                erSok={erSok}
                erApen={erApen}
                index={index}
                focus={currentFocusJuridiskEnhet === index && trykketNedIndex === -1}
                setFocus={setFocusJuridiskEnhet}
                setTrykketHoyrepilIndex={setTrykketHoyrepilIndex}
                setTrykketHoyrepil={setTrykketHoyrepil}
                setTrykketNed={setTrykketNed}
                setFocusUnderenhet={setFocusUnderenhet}
            />
            <ul
                className={`underenhetsvelger__menyvalg-wrapper--${
                    visUnderenheter ? 'apen' : 'lukket'
                }`}
                id={`underenhetvelger${juridiskEnhet.OrganizationNumber}`}
                role="menu"
                aria-label={`Underenheter til ${juridiskEnhet.Name}`}
            >
                {juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon, index2: number) => (
                    <Underenhet
                        key={organisasjon.OrganizationNumber}
                        underEnhet={organisasjon}
                        valgtOrganisasjon={valgtOrganisasjon}
                        history={history}
                        setErApen={setErApen}
                        hover={hover}
                        setHover={setHover}
                        erApen={erApen}
                        index={index2}
                        focus={focusUnderenhet === index2 && trykketNedIndex === index}
                        setFocus={setFocusUnderenhet}
                    />
                ))}
            </ul>
        </li>
    );
};

export default Underenhetsvelger;