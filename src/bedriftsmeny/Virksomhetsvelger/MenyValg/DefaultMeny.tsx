import React, { FunctionComponent } from 'react';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Organisasjon';
import { History } from 'history';
import Underenhetsvelger from "./Underenhetsvelger/Underenhetsvelger";

interface Props {
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

const DefaultMeny: FunctionComponent<Props> = (props) => {
    const { menyKomponenter = [], history } = props;

    return (
        <>
            {menyKomponenter.map((organisasjon) => (
                <Underenhetsvelger
                    key={organisasjon.JuridiskEnhet.Name}
                    juridiskEnhetMedUnderenheter={organisasjon}
                    history={history}
                />
            ))}
        </>
    );
};

export default DefaultMeny;
