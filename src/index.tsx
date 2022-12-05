import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { BodyLong, BodyShort } from '@navikt/ds-react';
import { Organisasjon } from './bedriftsmeny/organisasjon';
import Bedriftsmeny, { BedriftsmenyHeader, Virksomhetsvelger } from './bedriftsmeny/Bedriftsmeny';
import { MOCK_ORGANISASJONER } from './mock/organisasjoner';
import amplitude from './amplitude';
import { Bell } from '@navikt/ds-icons';

import '@navikt/ds-css';
import './index.less';
import './bedriftsmeny/index.css';

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
        <BrowserRouter>
            <div className="eksempelapp">
                <BedriftsmenyHeader tittel="foobar" />
                <Bedriftsmeny
                    sidetittel="Min side – arbeidsgiver"
                    undertittel="INNLOGGEDE TJENESTER for arbeidsgiver"
                    organisasjoner={organisasjoner}
                    onOrganisasjonChange={onOrganisasjonChange}
                    amplitudeClient={amplitude}
                >
                    <Bell className="eksempelapp__bjelleikon" title={"notifikasjon"}/>
                </Bedriftsmeny>

                <section className="eksempelapp__innhold" role="main">
                    <BodyLong style={{ wordWrap: 'break-word' }}>
                        Her ser du et eksempel på bruk av bedriftsmenyen. Hvis du endrer
                        organisasjon vil organisasjonsnummer i adressefeltet også endres
                        tilsvarende.
                    </BodyLong>
                    {valgtOrganisasjon && (
                        <div style={{ overflow: 'scroll', width: '70%' }}>
                            <BodyShort>
                                <em>Heisann, du har valgt en organisasjon!</em>
                            </BodyShort>
                            <code>{JSON.stringify(valgtOrganisasjon, null, 4)}</code>
                        </div>
                    )}

                    <p>
                        Her er en annen virksomhetsvelger:
                    </p>
                    <Virksomhetsvelger organisasjoner={organisasjoner} />

                </section>
            </div>
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('app'));
