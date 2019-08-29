import React, { FunctionComponent } from 'react';

import JuridiskEnhet from '../JuridiskEnhet/JuridiskEnhet';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../Organisasjon';
import { History } from 'history';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheterArray;
    history: History;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = (props) => {
    const { organisasjon, history } = props;

    return (
        <>
            <JuridiskEnhet organisasjon={organisasjon} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} history={history} />
        </>
    );
};

export default JuridiskEnhetMedUnderenheter;
