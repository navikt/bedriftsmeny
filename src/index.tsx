import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router-dom';
import {createBrowserHistory, History} from 'history';
import 'whatwg-fetch';


import {Normaltekst} from 'nav-frontend-typografi';

import {Organisasjon} from './bedriftsmeny/organisasjon';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import {MOCK_ORGANISASJONER} from './mock/organisasjoner';
import './index.less';
import amplitude from "./amplitude";
import {Bjelleikon} from "./bjelleikon";

const history: History = createBrowserHistory();

const App = () => {
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();
    const [organisasjoner, setOrganisasjoner] = useState<Organisasjon[] | undefined>(undefined);

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        setValgtOrganisasjon(organisasjon);
    };


    useEffect(() => {
        setTimeout(() => {
            setOrganisasjoner(MOCK_ORGANISASJONER);
        }, 500);
    }, []);

    return (
        <Router history={history}>
            <div className="eksempelapp">
                <Bedriftsmeny
                    sidetittel="Utviklingsapp"
                    organisasjoner={organisasjoner}
                    onOrganisasjonChange={onOrganisasjonChange}
                    history={history}
                    amplitudeClient={amplitude}
                >
                    <Bjelleikon/>
                </Bedriftsmeny>
                <section className="eksempelapp__innhold" role="main">
                    <Normaltekst>
                        Her ser du et eksempel på bruk av bedriftsmenyen. Hvis du endrer
                        organisasjon vil organisasjonsnummer i adressefeltet også endres
                        tilsvarende.
                    </Normaltekst>
                    {valgtOrganisasjon && (
                        <div style={{overflow:"scroll", width:"100%"}}>
                            <Normaltekst>
                                <em>Heisann, du har valgt en organisasjon!</em>
                            </Normaltekst>
                            <code >{JSON.stringify(valgtOrganisasjon, null, 4)}</code>
                        </div>
                    )}
                </section>
            </div>
        </Router>
    );
};

render(<App/>, document.getElementById('app'));
