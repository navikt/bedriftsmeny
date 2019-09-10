import React, { FunctionComponent } from 'react';
import JuridiskEnhetMedUnderenheter from './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Organisasjon';
import { History } from 'history';

interface Props {
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

const DefaultMeny: FunctionComponent<Props> = (props) => {
    const { menyKomponenter = [], history } = props;

    return (
        <>
            {menyKomponenter.map((organisasjon) => (
                <JuridiskEnhetMedUnderenheter
                    key={organisasjon.JuridiskEnhet.Name}
                    organisasjon={organisasjon}
                    history={history}
                />
            ))}
        </>
    );
};

export default DefaultMeny;
