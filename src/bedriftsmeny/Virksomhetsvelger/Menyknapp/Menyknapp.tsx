import React from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
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
    soketekst,
    setSoketekst
}: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const Chevron = erApen ? OppChevron : NedChevron;

    return (
        <button
            onClick={() => {
                setErApen(!erApen);
                const valgtUnderenhet = document.getElementById('valgtunderenhet');
                if (valgtUnderenhet && erApen && soketekst.length === 0) {
                    valgtUnderenhet.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                if (!erApen) {
                    setSoketekst('');
                }
            }}
            className="virksomhetsvelger__button"
            id="virksomhetsvelger__button"
            aria-label={`Virksomhetsvelger. Valgt virksomhet er ${navn}`}
            aria-pressed={erApen}
            aria-haspopup="true"
            aria-controls="virksomhetsvelger__dropdown"
            aria-expanded={erApen}
        >
            <div className="menyknapp">
                <UnderenhetIkon classname="menyknapp__ikon" />
                <div className="menyknapp__beskrivelse">
                    <Navn className="menyknapp__navn">{navn}</Navn>
                    org. nr. {orgnummer}
                </div>
                <Chevron className="menyknapp__chevron" />
            </div>
        </button>
    );
};

export default MenyKnapp;
