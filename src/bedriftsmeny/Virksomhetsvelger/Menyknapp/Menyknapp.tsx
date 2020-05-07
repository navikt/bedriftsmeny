import React from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import UnderenhetIkon from '../MenyValg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import './Menyknapp.less';

interface Props {
    navn: string;
    orgnummer: string;
    brukOverskrift?: boolean;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    soketekst: string;
    setSoketekst: (soketekst: string) => void;
}

const MenyKnapp = ({
    navn,
    orgnummer,
    brukOverskrift,
    erApen,
    setErApen,
    setSoketekst
}: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const Chevron = erApen ? OppChevron : NedChevron;

    return (
        <button
            onClick={() => {
                setErApen(!erApen);
                if (!erApen) {
                    setSoketekst('');
                }
            }}
            className="menyknapp"
            id="virksomhetsvelger__button"
            aria-label={`Virksomhetsvelger. Valgt virksomhet er ${navn}`}
            aria-pressed={erApen}
            aria-haspopup="true"
            aria-controls="virksomhetsvelger__dropdown"
            aria-expanded={erApen}
        >
            <div className="menyknapp__innhold">
                <UnderenhetIkon classname="menyknapp-ikon" />
                <div className="menyknapp-beskrivelse">
                    <Navn className="menyknapp-navn">{navn}</Navn>
                    org. nr. {orgnummer}
                </div>
                <Chevron className="menyknapp-chevron" />
            </div>
        </button>
    );
};

export default MenyKnapp;
