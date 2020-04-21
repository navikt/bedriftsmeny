import React, { FunctionComponent, Fragment } from 'react';
import './MenyFraSokeresultat.less';

import Underenhet from '../Underenhet/Underenhet';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Organisasjon';
import Organisasjonsbeskrivelse from "../../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse";

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
                <div className={'meny-fra-sokeresultat__juridisk-enhet-visning'}>
                <Organisasjonsbeskrivelse
                    erJuridiskEnhet
                    navn={juridiskEnhet.JuridiskEnhet.Name}
                    orgnummer={juridiskEnhet.JuridiskEnhet.Name}
                />
                </div>
                {UnderOrganisasjonsMenyKomponenter}
            </Fragment>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyFraSokeresultat;
