import React, {KeyboardEventHandler, MouseEventHandler, useState} from "react"
import "./MenyknappView.less"
import {NedChevron} from "nav-frontend-chevron";
import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import { Element, Normaltekst } from 'nav-frontend-typografi';


interface Props{
    navn: string,
    orgNummer: string,
    onClick:MouseEventHandler<HTMLButtonElement>,
    onKeyDown:KeyboardEventHandler<HTMLButtonElement>,
    isOpen:boolean,
}

export const MenyknappView=(props: Props)=>
    <button
        className="menyknapp menyknapp__menyknapp"
        onClick={props.onClick}
        onKeyDown={props.onKeyDown}
        id="virksomhetsvelger__button"
        aria-label={`Virksomhetsvelger. Valgt virksomhet er ${props.navn}, 
        Trykk enter for å ${props.isOpen ? 'lukke' : 'åpne'} denne menyen`}
        aria-pressed={props.isOpen}
        aria-expanded={props.isOpen}
        aria-haspopup="true"
        aria-controls="virksomhetsvelger__dropdown"
    >
        <div className="menyknapp__container">
            <UnderenhetIkon classname="menyknapp__ikon"/>
            <div className="menyknapp__tekstcontainer">
                <Element className="menyknapp__overtekst">
                    {props.navn}
                </Element>
                <Normaltekst className="menyknapp__undertekst">
                    virksomhetsnr. {props.orgNummer}
                </Normaltekst>
            </div>
            <div className="menyknapp__chevron">
                <NedChevron className={`menyknapp__chevron${props.isOpen ? '--ned' : '--opp'}`} />
            </div>
        </div>
    </button>
