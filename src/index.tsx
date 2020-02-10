import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './bedriftsmeny/Organisasjon';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import {MOCK_ORGANISASJONER2} from './mock/organisasjoner';
import './index.less';
import {byggOrganisasjonstre} from "./bedriftsmeny/byggOrganisasjonsTre";

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
            const byggTre = async (organisasjoner: Organisasjon[]) => {
                const juridiskeenheterMedBarn: JuridiskEnhetMedUnderEnheterArray[] = await byggOrganisasjonstre(
                    organisasjoner
                );
                return juridiskeenheterMedBarn;
            };
            byggTre(MOCK_ORGANISASJONER2).then(juridiskeenheterMedBarn => setOrganisasjonstre(juridiskeenheterMedBarn));

        }, 500);
    }, [MOCK_ORGANISASJONER2]);

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
