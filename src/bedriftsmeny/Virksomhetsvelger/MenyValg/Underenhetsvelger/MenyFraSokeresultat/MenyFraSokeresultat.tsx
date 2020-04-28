import React, { FunctionComponent, Fragment } from 'react';
import { History } from 'history';
import Underenhet from '../Underenhet/Underenhet';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../Organisasjon';
import Organisasjonsbeskrivelse from '../../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import './MenyFraSokeresultat.less';

export interface Props {
    ListeMedObjektFraSok?: JuridiskEnhetMedUnderEnheterArray[];
    setErApen: (bool: boolean) => void;
    history: History;
    valgtOrganisasjon: Organisasjon;
}

const MenyFraSokeresultat: FunctionComponent<Props> = (props) => {
    const { ListeMedObjektFraSok = [], setErApen, history, valgtOrganisasjon } = props;

    return (
        <>
            {ListeMedObjektFraSok.map(juridiskEnhet => (
                <Fragment key={juridiskEnhet.JuridiskEnhet.OrganizationNumber}>
                    <div className={'meny-fra-sokeresultat__juridisk-enhet-visning'}>
                        <Organisasjonsbeskrivelse
                            erJuridiskEnhet
                            navn={juridiskEnhet.JuridiskEnhet.Name}
                            orgnummer={juridiskEnhet.JuridiskEnhet.Name}
                        />
                    </div>
                    <ul
                        className="underenhetsvelger__menyvalg-wrapper"
                        id={`underenhetvelger${juridiskEnhet.JuridiskEnhet.OrganizationNumber}`}
                        role="menu"
                        aria-label={`Velg underenhet til ${juridiskEnhet.JuridiskEnhet.Name}`}
                    >
                        {juridiskEnhet.Underenheter.map(org => (
                            <Underenhet
                                key={org.OrganizationNumber}
                                underEnhet={org}
                                setErApen={setErApen}
                                history={history}
                                valgtOrganisasjon={valgtOrganisasjon}
                            />
                        ))}
                    </ul>
                </Fragment>
            ))}
        </>
    );
};

export default MenyFraSokeresultat;
