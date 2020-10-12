import React, { Dispatch, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Normaltekst } from 'nav-frontend-typografi';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../organisasjon';

interface Props {
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    visUnderenheter: boolean;
    setVisUnderenheter: (bool: boolean) => void;
    valgtOrganisasjon: Organisasjon;
    setJuridiskEnhetTrykketPaa: (enhet: string) => void;
    setHover: (bool: boolean) => void;
    erSok: boolean;
    erApen: boolean;
    index: number;
    focus: boolean;
    setFocus: (num: number) => void;
    setTrykketHoyrepilIndex: (num: number) => void;
    setTrykketHoyrepil: (bool: boolean) => void;
    setTrykketNed: (num: number) => void;
    setFocusUnderenhet: (num: number) => void;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = (props) => {
    const {juridiskEnhetMedUnderenheter, visUnderenheter, setVisUnderenheter, valgtOrganisasjon, setJuridiskEnhetTrykketPaa, setTrykketHoyrepilIndex, setTrykketHoyrepil, setTrykketNed, setHover, erSok, index, focus, setFocus, erApen, setFocusUnderenhet } = props;
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const underenheter = juridiskEnhetMedUnderenheter.Underenheter;
    const erValgtOrganisasjon = valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;

    const valgtunderenhet =
        valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            ? ' - 1 valgt'
            : '';

    const tekstDefault =  underenheter.length === 1 ? 'virksomhet' : 'virksomheter';
    const labelDefault = `${visUnderenheter ? 'Skjul' : 'Vis'} ${
        underenheter.length
    } ${tekstDefault}${valgtunderenhet}`;

    const tekstSok = juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet ? 'treff' : tekstDefault;
    const labelSok = `${underenheter.length} ${tekstSok}`;
    const label = erSok ? labelSok : labelDefault;

    const [oppChevron, setOppChevron] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        setOppChevron(false);
        if (visUnderenheter) setOppChevron(true);

        if (focus) {
            // @ts-ignore
            ref.current && ref.current.focus();
        }

    }, [visUnderenheter, focus]);

    return (
        <button
            tabIndex={focus && erApen ? 0 : -1}
            ref={ref}
            onClick={() => {
                if (visUnderenheter) {
                    setJuridiskEnhetTrykketPaa('ikkevis');
                    setTrykketHoyrepilIndex(-1);
                    setTrykketHoyrepil(false);
                    // setFocus(index);
                    setTrykketNed(-1);
                    setFocusUnderenhet(0);
                } else {
                    setJuridiskEnhetTrykketPaa(juridiskEnhet.OrganizationNumber);
                    setTrykketHoyrepilIndex(index);
                    setTrykketHoyrepil(true);
                    setTrykketNed(index)
                    setFocus(index)
                }
                setVisUnderenheter(!props.visUnderenheter);
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => setHover(false)}
            className={`underenhetsvelger__button ${visUnderenheter ? 'juridiskenhet--apen' : 'juridiskenhet--lukket'} ${props.index === 0 ? 'juridiskenhet--first' : ''}`}
            id={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : ''
            }
            aria-label={`Velg underenheter for ${juridiskEnhet.Name} ${label}`}
            aria-pressed={visUnderenheter}
            aria-haspopup="true"
            aria-controls={`underenhetvelger ${juridiskEnhet.OrganizationNumber}`}
            aria-expanded={visUnderenheter}
        >
            <Organisasjonsbeskrivelse
                erJuridiskEnhet
                navn={juridiskEnhet.Name}
                orgnummer={juridiskEnhet.OrganizationNumber}
            />
            <Normaltekst className="underenhetsvelger__button__label">{label}</Normaltekst>
            <div className="underenhetsvelger__button__chevron">
                {oppChevron ? (
                    <OppChevron />
                ) : (
                    <NedChevron />
                )}
            </div>
        </button>
    );
};

export default UnderenhetsVelgerMenyButton;
