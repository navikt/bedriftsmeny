import React, { FunctionComponent, Fragment } from 'react';

import Underenhet from './Underenhetsvelger/Underenhet/Underenhet';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Organisasjon';
import Organisasjonsbeskrivelse from "../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse";

export interface Props {
    ListeMedObjektFraSok?: JuridiskEnhetMedUnderEnheterArray[];
}

const MenyFraSokeresultat: FunctionComponent<Props> = (props) => {
    const { ListeMedObjektFraSok = [] } = props;

    const menyKomponenter = ListeMedObjektFraSok.map((juridiskEnhet) => {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.Underenheter.map((org) => (
            <Underenhet key={org.Name} underEnhet={org} />
        ));

        return (
            <Fragment key={juridiskEnhet.JuridiskEnhet.OrganizationNumber}>
                <Organisasjonsbeskrivelse
                    erJuridiskEnhet
                    navn={juridiskEnhet.JuridiskEnhet.Name}
                    orgnummer={juridiskEnhet.JuridiskEnhet.Name}
                />
                {UnderOrganisasjonsMenyKomponenter}
            </Fragment>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyFraSokeresultat;
