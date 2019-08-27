import React, { FunctionComponent } from 'react';

import JuridiskEnhet from '../JuridiskEnhet/JuridiskEnhet';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../Organisasjon';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheterArray;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = (props) => {
    return (
        <>
            <JuridiskEnhet organisasjon={props.organisasjon} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </>
    );
};

export default JuridiskEnhetMedUnderenheter;
