import React, { FunctionComponent } from 'react';

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
            <Underenhetsvelger organisasjon={organisasjon} hovedOrganisasjon={props.organisasjon} history={history} />
    );
};

export default JuridiskEnhetMedUnderenheter;
