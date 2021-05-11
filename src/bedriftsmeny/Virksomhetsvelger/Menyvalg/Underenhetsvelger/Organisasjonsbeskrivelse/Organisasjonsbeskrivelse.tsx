import React from 'react';

import { Undertittel, Element, Normaltekst } from 'nav-frontend-typografi';

import JuridiskEnhetIkon from './JuridiskEnhetIkon';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
    brukOverskrift?: boolean;
}

const Organisasjonsbeskrivelse = ({ navn, orgnummer, erJuridiskEnhet, brukOverskrift }: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const Ikon = erJuridiskEnhet ? JuridiskEnhetIkon : UnderenhetIkon;
    const tekst = erJuridiskEnhet ? `org.nr. ${orgnummer}` : `virksomhetsnr. ${orgnummer}`

    return (
        <div className="organisasjonsbeskrivelse">
            <Ikon classname="organisasjonsbeskrivelse__ikon" />
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Navn className="organisasjonsbeskrivelse__navn" title={navn.length > 26 ? navn : ''}>
                   {navn}
                </Navn>
                <Normaltekst aria-label={tekst}>{tekst}</Normaltekst>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;