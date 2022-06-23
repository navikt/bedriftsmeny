import React, {KeyboardEventHandler, MouseEventHandler, useState} from "react"
import "./virksomhetsvelger2.less"
import {NedChevron} from "nav-frontend-chevron";
import UnderenhetIkon from './Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import { Element, Normaltekst } from 'nav-frontend-typografi';


interface Props{
    navn: string,
    orgNummer: string,
    onClick:MouseEventHandler<HTMLButtonElement>,
    onKeyDown:KeyboardEventHandler<HTMLButtonElement>,
    isOpen:boolean,
}

export const Virksomhetsvelger2=(props: Props)=>{


    return    <button
        className="virksomhetsvelger2 virksomhetsvelger2__menyknapp"
        onClick={props.onClick}
        onKeyDown={props.onKeyDown}
        id="virksomhetsvelger__button" //TODO Trenger vi denne?
        aria-label={`Virksomhetsvelger. Valgt virksomhet er ${props.navn}, 
        Trykk enter for å ${props.isOpen ? 'lukke' : 'åpne'} denne menyen`}
        aria-pressed={props.isOpen}
        aria-expanded={props.isOpen}
        aria-haspopup="true"
        aria-controls="virksomhetsvelger__dropdown" //TODO fiks this
    >
        <div className="virksomhetsvelger2__container">
            <UnderenhetIkon classname="virksomhetsvelger2__ikon"/>
            <div className="virksomhetsvelger2__tekstcontainer">
                <Element className="virksomhetsvelger2__overtekst">
                    {props.navn}
                </Element>
                <Normaltekst className="virksomhetsvelger2__undertekst">
                    virksomhetsnr. {props.orgNummer}
                </Normaltekst>
            </div>
            <div className="virksomhetsvelger2__chevron">
                <NedChevron className={`virksomhetsvelger2__chevron${props.isOpen ? '--ned' : '--opp'}`} />
            </div>
        </div>
    </button>
}