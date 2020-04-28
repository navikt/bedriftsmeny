import React from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import UnderenhetIkon from '../Organisasjonsbeskrivelse/UnderenhetIkon';
import './Menyknapp.less';

interface Props {
    navn: string;
    orgnummer: string;
    brukOverskrift?: boolean;
    erApen: boolean;
}

const MenyKnapp = ({ navn, orgnummer, brukOverskrift, erApen }: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const Chevron = erApen ? OppChevron : NedChevron;

    return (
        <div className="menyknapp">
            <UnderenhetIkon classname="menyknapp__ikon" />
            <div className="menyknapp__beskrivelse">
                <Navn className="menyknapp__navn">{navn}</Navn>
                org. nr. {orgnummer}
            </div>
            <Chevron className="menyknapp__chevron" />
        </div>
    );
};

export default MenyKnapp;
