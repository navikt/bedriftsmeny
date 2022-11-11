import React from 'react';

import JuridiskEnhetIkon from './JuridiskEnhetIkon';
import UnderenhetIkon from './UnderenhetIkon';
import { Heading, BodyShort } from '@navikt/ds-react';

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
}

const Organisasjonsbeskrivelse = ({ navn, orgnummer, erJuridiskEnhet }: Props) => {
    const Ikon = erJuridiskEnhet ? JuridiskEnhetIkon : UnderenhetIkon;
    const tekst = erJuridiskEnhet ? `org.nr. ${orgnummer}` : `virksomhetsnr. ${orgnummer}`;

    return (
        <div className="organisasjonsbeskrivelse">
            <Ikon classname="organisasjonsbeskrivelse__ikon" />
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Heading
                    title={navn.length > 26 ? navn : ''}
                    level="4"
                    size="small"
                    className="organisasjonsbeskrivelse__navn"
                >
                    {navn}
                </Heading>
                <BodyShort aria-label={tekst}>{tekst}</BodyShort>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
