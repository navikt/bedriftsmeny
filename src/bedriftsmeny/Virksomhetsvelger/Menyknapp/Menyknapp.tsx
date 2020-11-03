import React, { useEffect, useState } from 'react';
import { Undertittel, Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import './Menyknapp.less';
import { erPilNavigasjon, setfokusPaSokefelt } from '../Menyvalg/pilnavigerinsfunksjoner';

interface Props {
    navn: string;
    orgnummer: string;
    brukOverskrift?: boolean;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setSoketekst: (soketekst: string) => void;
}

const MenyKnapp = ({ navn, orgnummer, brukOverskrift, erApen, setErApen, setSoketekst }: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const [oppChevron, setOppChevron] = useState(false);

    useEffect(() => {
        setOppChevron(false);
        if (erApen)  {
            setOppChevron(true);
        }
    }, [erApen]);

    const onKeyPress = (key: string, skift: boolean) => {
        if (key === 'ArrowDown' || key === 'Down') {
            if (erApen) {
                setfokusPaSokefelt();
                setSoketekst('');
            }
        }
        if (key === 'Tab' && skift) {
            setErApen(false);
        }
    }

    return (
        <button
            onClick={() => {
                setSoketekst('');
                setErApen(!erApen)
            }}
            onKeyDown={ (e) => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault()
                    e.stopPropagation()
                }
                onKeyPress(e.key, e.shiftKey)
            }
            }
            className="menyknapp"
            id="virksomhetsvelger__button"
            aria-label={
                `Virksomhetsvelger. Valgt virksomhet er ${navn}, Trykk enter for å ${
                    erApen? 'lukke' : 'åpne'} denne menyen`
            }
            aria-pressed={erApen}
            aria-haspopup="true"
            aria-controls="virksomhetsvelger__dropdown"
            aria-expanded={erApen}>
            <div className="menyknapp__innhold">
                <UnderenhetIkon classname="menyknapp-ikon" />
                <Normaltekst className="menyknapp-beskrivelse">
                    <Navn className="menyknapp-navn">{navn}</Navn>
                    org. nr. {orgnummer}
                </Normaltekst>
                {oppChevron ? (
                    <OppChevron className="menyknapp-chevron" />
                ) : (
                    <NedChevron className="menyknapp-chevron" />
                )}
            </div>
        </button>
    );
};

export default MenyKnapp;
