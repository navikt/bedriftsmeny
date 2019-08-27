import React, { FunctionComponent } from 'react';
import JuridiskEnhetMedUnderenheter from './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Organisasjon';

interface Props {
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[];
}

const DefaultMeny: FunctionComponent<Props> = ({ menyKomponenter }) => (
    <>
        {menyKomponenter.map((organisasjon) => (
            <JuridiskEnhetMedUnderenheter
                key={organisasjon.JuridiskEnhet.Name}
                organisasjon={organisasjon}
            />
        ))}
    </>
);

export default DefaultMeny;
