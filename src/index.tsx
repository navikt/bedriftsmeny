import React from 'react';
import { render } from 'react-dom';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './bedriftsmeny/Organisasjon';
import MOCK_ORGANISASJONER from './mock/organisasjoner';

import './index.less';

export function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] {
    let juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    let utenTilgangTilJuridiskEnhetBedrifter = organisasjoner;
    let organisasjonsliste = juridiskeEnheter.map((juridiskEnhet) => {
        const underenheter = organisasjoner.filter((underenhet) => {
            if (underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber) {
                utenTilgangTilJuridiskEnhetBedrifter = utenTilgangTilJuridiskEnhetBedrifter.filter(
                    (organisasjon) => {
                        return organisasjon.OrganizationNumber !== underenhet.OrganizationNumber;
                    }
                );

                return underenhet;
            }

            return false;
        });

        return {
            JuridiskEnhet: juridiskEnhet,
            Underenheter: underenheter
        };
    });

    return organisasjonsliste;
}

const organisasjoner = MOCK_ORGANISASJONER;
const organisasjonstre = byggOrganisasjonstre(MOCK_ORGANISASJONER);

const App = () => (
    <>
        <h1>Utviklingsapp for bedriftsmeny</h1>
        <Bedriftsmeny
            organisasjoner={organisasjoner}
            organisasjonstre={organisasjonstre}
            valgtOrganisasjon={organisasjoner[0]}
        />
    </>
);

render(<App />, document.getElementById('app'));
