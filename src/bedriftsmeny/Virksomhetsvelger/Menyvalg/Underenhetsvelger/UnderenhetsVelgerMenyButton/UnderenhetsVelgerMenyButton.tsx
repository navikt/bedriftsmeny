import React, { FunctionComponent } from 'react';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Normaltekst } from 'nav-frontend-typografi';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../organisasjon';

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
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => setHover(false)}
            className={`underenhetsvelger__button ${visUnderenheter ? 'juridiskenhet--apen' : 'juridiskenhet--lukket'}`}
            id={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : ''
            }
            aria-label={`Velg underenheter for juridisk enhet ${juridiskEnhet.Name}`}
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
