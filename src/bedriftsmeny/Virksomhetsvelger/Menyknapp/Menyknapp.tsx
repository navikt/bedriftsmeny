import React, { FunctionComponent } from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';
import {NedChevron, OppChevron} from "nav-frontend-chevron";
import UnderenhetIkon from "../Organisasjonsbeskrivelse/UnderenhetIkon";
import './Menyknapp.less';

interface Props {
    navn: string;
    orgnummer: string;
    brukOverskrift?: boolean;
    erApen?: boolean;

}

const MenyKnapp: FunctionComponent<Props> = (props) => {
    const { navn, orgnummer, brukOverskrift, erApen } = props;

    const Navn = brukOverskrift ? Undertittel : Element;
    const Chevron = erApen ? OppChevron : NedChevron;

    return (
        <div className="menyknapp">
            <div className="menyknapp__ikon">
                <UnderenhetIkon />
            </div>
            <div className="menyknapp__beskrivelse">
                <Navn className="menyknapp__navn">{navn}</Navn>
                org. nr. {orgnummer}
            </div>
            <Chevron className={'menyknapp__chevron'} />
        </div>
    );
};

export default MenyKnapp;
