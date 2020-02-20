import React, { FunctionComponent } from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';

import JuridiskEnhetIkon from './JuridiskEnhetIkon';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';
import {NedChevron, OppChevron} from "nav-frontend-chevron";

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
    brukOverskrift?: boolean;

}

const Organisasjonsbeskrivelse: FunctionComponent<Props> = (props) => {
    const { navn, orgnummer, erJuridiskEnhet, brukOverskrift } = props;

    const Navn = brukOverskrift ? Undertittel : Element;
    const Ikon = erJuridiskEnhet ? JuridiskEnhetIkon : UnderenhetIkon;

    return (
        <div className="organisasjonsbeskrivelse">
            <div className="organisasjonsbeskrivelse__ikon">
                <Ikon />
            </div>
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Navn className="organisasjonsbeskrivelse__navn">{navn}</Navn>
                org. nr. {orgnummer}
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
