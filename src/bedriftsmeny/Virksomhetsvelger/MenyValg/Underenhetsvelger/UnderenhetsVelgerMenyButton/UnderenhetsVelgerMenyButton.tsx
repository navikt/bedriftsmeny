import React, { FunctionComponent } from 'react';
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
    hover: boolean;
    setHover: (bool: boolean) => void;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = (props) => {
    const juridiskEnhet = props.juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const Chevron = props.visUnderenheter ? OppChevron : NedChevron;
    const valgtunderenhet =
        props.valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            ? ' - 1 valgt'
            : '';
    const label = `${props.visUnderenheter ? 'Skjul' : 'Vis'} ${
        props.juridiskEnhetMedUnderenheter.Underenheter.length
    } underenheter${valgtunderenhet}`;

    return (
        <button
            onClick={() => {
                if (!props.visUnderenheter) {
                    props.setJuridiskEnhetTrykketPaa(juridiskEnhet.OrganizationNumber);
                }
                props.setVisUnderenheter(!props.visUnderenheter);
            }}
            onMouseOver={() => {
                props.setHover(true);
            }}
            onMouseLeave={() => props.setHover(false)}
            className="underenhetsvelger__button"
            id={
                props.valgtOrganisasjon.ParentOrganizationNumber ===
                juridiskEnhet.OrganizationNumber
                    ? 'valgtjuridiskenhet'
                    : ''
            }
            aria-label={`Underenhetvelger for ${juridiskEnhet.Name} organisasjonsnummer ${juridiskEnhet.OrganizationNumber}`}
            aria-pressed={props.visUnderenheter}
            aria-haspopup="true"
            aria-controls={`underenhetvelger${juridiskEnhet.OrganizationNumber}`}
            aria-expanded={props.visUnderenheter}
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
