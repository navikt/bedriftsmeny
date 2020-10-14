import React, { FunctionComponent, useEffect, useState } from 'react';
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
    erApen: boolean;
    setNyOrganisasjonIFokus: (KeypressKey: string, erJuridiskEnhetValgt: boolean) => void;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = (props) => {
    const {juridiskEnhetMedUnderenheter, visUnderenheter, setVisUnderenheter, valgtOrganisasjon, setJuridiskEnhetTrykketPaa, setHover, erSok, erApen, setNyOrganisasjonIFokus } = props;
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

    useEffect(() => {
        setOppChevron(false);
        if (visUnderenheter) setOppChevron(true);
    }, [visUnderenheter]);

    return (
        <button
            tabIndex={erApen ? 0 : -1}
            onClick={() => {
                if (visUnderenheter) {
                    setJuridiskEnhetTrykketPaa('ikkevis');
                } else {
                    setJuridiskEnhetTrykketPaa(juridiskEnhet.OrganizationNumber);
                }
                setVisUnderenheter(!props.visUnderenheter);
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onKeyDown={ (e) => {
                console.log("funksjon kalles fra juridisk enhet")
                setNyOrganisasjonIFokus(e.key, visUnderenheter)
            }}
            onMouseLeave={() => setHover(false)}
            className={`underenhetsvelger__button ${visUnderenheter ? 'juridiskenhet--apen' : 'juridiskenhet--lukket'}`}
            id={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : 'organisasjons-id-' + juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber
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
