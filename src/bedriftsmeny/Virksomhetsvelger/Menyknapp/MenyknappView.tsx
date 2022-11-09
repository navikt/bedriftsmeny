import React, { KeyboardEventHandler, MouseEventHandler } from 'react';
import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import { Collapse, Expand } from '@navikt/ds-icons';
import { Heading, BodyShort } from '@navikt/ds-react';
import './MenyknappView.less';

interface Props {
    navn: string;
    orgNummer: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
    isOpen: boolean;
}

export const MenyknappView = (props: Props) => (
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
        aria-controls="virksomhetsvelger__dropdown">
        <div className="menyknapp__container">
            <UnderenhetIkon classname="menyknapp__ikon" />
            <div className="menyknapp__tekstcontainer">
                <Heading size="small" className="menyknapp__overtekst">
                    {props.navn}
                </Heading>
                <BodyShort className="menyknapp__undertekst">
                    virksomhetsnr. {props.orgNummer}
                </BodyShort>
            </div>
            <div className="menyknapp__chevron">{props.isOpen ? <Collapse /> : <Expand />}</div>
        </div>
    </button>
);
