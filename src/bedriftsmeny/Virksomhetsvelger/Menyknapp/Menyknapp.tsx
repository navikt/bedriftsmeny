import React from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';

import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import { erPilNavigasjon, setfokusPaSokefelt } from '../Menyvalg/pilnavigerinsfunksjoner';
import './Menyknapp.less';

interface Props {
    navn: string;
    orgnummer: string;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setSoketekst: (soketekst: string) => void;
}

const MenyKnapp = ({ navn, orgnummer, erApen, setErApen, setSoketekst }: Props) => {
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
    };

    return (
        <button
            onClick={() => {
                setSoketekst('');
                setErApen(!erApen);
            }}
            onKeyDown={(e) => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                onKeyPress(e.key, e.shiftKey);
            }}
            className="menyknapp"
            id="virksomhetsvelger__button"
            aria-label={`Virksomhetsvelger. Valgt virksomhet er ${navn}, Trykk enter for å ${
                erApen ? 'lukke' : 'åpne'
            } denne menyen`}
            aria-pressed={erApen}
            aria-haspopup="true"
            aria-controls="virksomhetsvelger__dropdown"
            aria-expanded={erApen}>
            <div className="menyknapp__innhold">
                <UnderenhetIkon classname="menyknapp-ikon" />
                <div className="menyknapp-beskrivelse">
                    <Element className="menyknapp-navn">{navn}</Element>
                    <Normaltekst>virksomhetsnr. {orgnummer}</Normaltekst>
                </div>
                <NedChevron className={`menyknapp__chevron${erApen ? '--ned' : '--opp'}`} />
            </div>
        </button>
    );
};

export default MenyKnapp;
