import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './bedriftsmeny/Organisasjon';
import MOCK_ORGANISASJONER from './mock/organisasjoner';

import './index.less';
import { Router } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';

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

const history: History = createBrowserHistory();

const App = () => {
    const [organisasjoner, setOrganisasjoner] = useState<Organisasjon[]>([]);
    const [organisasjonstre, setOrganisasjonstre] = useState<JuridiskEnhetMedUnderEnheterArray[]>(
        []
    );

    useEffect(() => {
        setTimeout(() => {
            setOrganisasjoner(MOCK_ORGANISASJONER);
            setOrganisasjonstre(byggOrganisasjonstre(MOCK_ORGANISASJONER));
        }, 500);
    }, []);

    return (
        <Router history={history}>
            <div className="eksempelapp">
                <Bedriftsmeny
                    sidetittel="Utviklingsapp"
                    organisasjoner={organisasjoner}
                    organisasjonstre={organisasjonstre}
                    history={history}
                />
                <main>
                    Her ser du et eksempel på bruk av bedriftsmenyen. Hvis du endrer organisasjon
                    vil organisasjonsnummer i adressefeltet også endres tilsvarende.
                </main>
            </div>
        </Router>
    );
};

render(<App />, document.getElementById('app'));
