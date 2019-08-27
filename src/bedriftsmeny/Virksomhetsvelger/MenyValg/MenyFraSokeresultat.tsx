import React, { FunctionComponent } from 'react';

import Underenhet from './Underenhet/Underenhet';
import JuridiskEnhet from './JuridiskEnhet/JuridiskEnhet';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Organisasjon';

export interface Props {
    ListeMedObjektFraSok: JuridiskEnhetMedUnderEnheterArray[];
}

const MenyFraSokeresultat: FunctionComponent<Props> = (props) => {
    const menyKomponenter = props.ListeMedObjektFraSok.map((juridiskEnhet) => {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.Underenheter.map((org) => (
            <Underenhet key={org.Name} underEnhet={org} />
        ));

        return (
            <>
                <JuridiskEnhet organisasjon={juridiskEnhet} />
                {UnderOrganisasjonsMenyKomponenter}
            </>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyFraSokeresultat;
