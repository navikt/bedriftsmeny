import React from 'react';
import { BodyLong, BodyShort } from '@navikt/ds-react';
import { BedriftsmenyHeader } from '@/bedriftsmeny/Bedriftsmeny';
import { MOCK_ORGANISASJONER } from '@/mock/organisasjoner';
import Banner, { useHentOrgnummer } from '@/components/Layout/Banner/Banner';

const App = () => {
    const {orgnr} = useHentOrgnummer()

    const valgtOrganisasjon = MOCK_ORGANISASJONER.find(o => o.OrganizationNumber === orgnr)

    return (
        <div className="eksempelapp">
            <div style={{borderBottom: "1px solid gray", height: "42px"}}> dekoratøren </div>
            <BedriftsmenyHeader tittel="foobar" />
            <Banner organisasjoner={MOCK_ORGANISASJONER} ></Banner>

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
            </section>
        </div>
    );
};

export default App;
