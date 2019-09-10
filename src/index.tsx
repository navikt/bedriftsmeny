import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './bedriftsmeny/Organisasjon';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import MOCK_ORGANISASJONSTRE from './mock/organisasjoner';
import './index.less';

const history: History = createBrowserHistory();

const App = () => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();
    const [organisasjonstre, setOrganisasjonstre] = useState<
        JuridiskEnhetMedUnderEnheterArray[] | undefined
    >(undefined);

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        setValgtOrganisasjon(organisasjon);
    };

    useEffect(() => {
        setTimeout(() => {
            setOrganisasjonstre(MOCK_ORGANISASJONSTRE);
        }, 500);
    }, []);

    return (
        <Router history={history}>
            <div className="eksempelapp">
                <Bedriftsmeny
                    sidetittel="Utviklingsapp"
                    organisasjonstre={organisasjonstre}
                    onOrganisasjonChange={onOrganisasjonChange}
                    history={history}
                />
                <main>
                    <p>
                        Her ser du et eksempel på bruk av bedriftsmenyen. Hvis du endrer
                        organisasjon vil organisasjonsnummer i adressefeltet også endres
                        tilsvarende.
                    </p>
                    {valgtOrganisasjon && (
                        <>
                            <p>
                                <em>Heisann, du har valgt en organisasjon!</em>
                            </p>
                            <code>{JSON.stringify(valgtOrganisasjon, null, 4)}</code>
                        </>
                    )}
                </main>
            </div>
        </Router>
    );
};

render(<App />, document.getElementById('app'));
