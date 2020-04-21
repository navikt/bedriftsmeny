import React, { FunctionComponent } from 'react';

import Organisasjonsbeskrivelse from '../../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Organisasjon';
import {NedChevron, OppChevron} from "nav-frontend-chevron";
import {Normaltekst} from "nav-frontend-typografi";
import {Button} from "react-aria-menubutton";

interface Props {
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    visUnderenheter: boolean;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = (props) => {
    const juridiskEnhet = props.juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const Chevron = props.visUnderenheter ? OppChevron : NedChevron;
    const label = `${props.visUnderenheter ? 'Skjul' : 'Vis'} ${
        props.juridiskEnhetMedUnderenheter.Underenheter.length
    } underenheter`;

    return (
        <Button className={'underenhetsvelger__button'}>
            <Organisasjonsbeskrivelse
                erJuridiskEnhet
                navn={juridiskEnhet.Name}
                orgnummer={juridiskEnhet.OrganizationNumber}
            />
            <Normaltekst className="underenhetsvelger__button__label">{label}</Normaltekst>
            <div className="underenhetsvelger__button__chevron">
                <Chevron />
            </div>
        </Button>
    );
};

export default UnderenhetsVelgerMenyButton;
