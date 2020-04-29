import React, { FunctionComponent, useEffect, useState } from 'react';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Normaltekst } from 'nav-frontend-typografi';
import Organisasjonsbeskrivelse from '../../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../Organisasjon';

interface Props {
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    visUnderenheter: boolean;
    setVisUnderenheter: (bool: boolean) => void;
    valgtOrganisasjon: Organisasjon;
    setJuridiskEnhetTrykketPaa: (enhet: string) => void;
    setHover: (bool: boolean) => void;
    erSok: boolean;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = (props) => {
    const {juridiskEnhetMedUnderenheter, visUnderenheter, setVisUnderenheter, valgtOrganisasjon, setJuridiskEnhetTrykketPaa, setHover, erSok } = props;
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const underenheter = juridiskEnhetMedUnderenheter.Underenheter;
    const Chevron = props.visUnderenheter ? OppChevron : NedChevron;
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

    return (
        <button
            onClick={() => {
                if (!visUnderenheter) {
                    setJuridiskEnhetTrykketPaa(juridiskEnhet.OrganizationNumber);
                }
                setVisUnderenheter(!props.visUnderenheter);
                /*
                const scrolltil = erValgtOrganisasjon
                    ? document.querySelector('#valgjuridiskenhet')
                    : document.querySelector('.underenhetsvelger__button.juridiskenhet--apen + ul')
                ;
                if (scrolltil) {
                    scrolltil.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                */
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => setHover(false)}
            className={`underenhetsvelger__button ${visUnderenheter && !erValgtOrganisasjon ? 'juridiskenhet--apen' : ''}`}
            id={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : ''
            }
            aria-label={`Underenhetvelger for ${juridiskEnhet.Name} organisasjonsnummer ${juridiskEnhet.OrganizationNumber}`}
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
                <Chevron />
            </div>
        </button>
    );
};

export default UnderenhetsVelgerMenyButton;
