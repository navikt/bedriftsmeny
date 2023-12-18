import React, {ForwardedRef, forwardRef, useState} from 'react';
import {Office1, Success} from '@navikt/ds-icons';
import {Accordion, BodyShort, Button} from '@navikt/ds-react';
import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from '../organisasjon';
import {a11yOrgnr} from "./utils";

type Props = {
    juridiskEnhet: JuridiskEnhetMedUnderEnheterArray;
    fokusertEnhet: Organisasjon;
    onUnderenhetClick: (underenhet: Organisasjon) => void;
    enhetRef: ForwardedRef<HTMLButtonElement>;
    forceTabbable: boolean;
};

const JuridiskEnhet = (
    {
        juridiskEnhet,
        fokusertEnhet,
        onUnderenhetClick,
        enhetRef,
        forceTabbable,
    }: Props
) => {
    const {JuridiskEnhet, Underenheter} = juridiskEnhet;
    const juridiskEnhetErValgt =
        fokusertEnhet.OrganizationNumber ===
        JuridiskEnhet.OrganizationNumber;
    const underenhetErValgt = Underenheter.some(
        (enhet: Organisasjon) => enhet.OrganizationNumber === fokusertEnhet.OrganizationNumber
    );
    const juridiskEnhetErAktiv = underenhetErValgt || juridiskEnhetErValgt;
    const [open, setOpen] = useState(juridiskEnhetErAktiv);

    return (
        <li className='navbm-virksomhetsvelger__juridisk-enhet'>
            <Accordion.Item open={underenhetErValgt || open} role="group">
                <Accordion.Header
                    tabIndex={juridiskEnhetErAktiv || forceTabbable ? 0 : -1}
                    ref={juridiskEnhetErValgt ? enhetRef : null}
                    onClick={() => {
                        setOpen(!open);
                    }}
                    aria-owns={`underenheter-${JuridiskEnhet.OrganizationNumber}`}
                    style={{backgroundColor: open ? 'var(--a-surface-action-subtle' : 'transparent'}}
                >
                    <Hovedenhet
                        hovedenhet={JuridiskEnhet}
                        valgt={underenhetErValgt}
                        antallUnderenheter={Underenheter.length}
                    />
                </Accordion.Header>
                <Accordion.Content>
                    <ul className='navbm-virksomhetsvelger__underenheter'
                        id={`underenheter-${JuridiskEnhet.OrganizationNumber}`}>
                        {Underenheter.map((virksomhet) => {
                            const underenhetErValgt = fokusertEnhet.OrganizationNumber === virksomhet.OrganizationNumber

                            return (
                                <li key={virksomhet.OrganizationNumber}>
                                    <Underenhet
                                        underenhet={virksomhet}
                                        valgt={underenhetErValgt}
                                        ref={underenhetErValgt ? enhetRef : null}
                                        onClick={onUnderenhetClick}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </li>
    );
};

type UnderenhetProps = {
    valgt: boolean;
    onClick: (underenhet: Organisasjon) => void;
    underenhet: Organisasjon;
}

const Underenhet = forwardRef<HTMLButtonElement, UnderenhetProps>(({valgt, onClick, underenhet}, ref) =>
    <Button
        type="button"
        ref={ref}
        tabIndex={valgt ? 0 : -1}
        aria-pressed={valgt}
        variant='tertiary'
        onClick={() => onClick(underenhet)}
        className='navbm-virksomhetsvelger__underenhet-innhold'
    >
        <div className='navbm-virksomhetsvelger__enhet'>
            <Office1 aria-hidden={true}/>
            <div className='navbm-virksomhetsvelger__enhet-tekst'>
                <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'
                           aria-label={`Underenhet ${underenhet.Name}`}>
                    {underenhet.Name}
                </BodyShort>
                <BodyShort aria-label={`virksomhetsnummer ${a11yOrgnr(underenhet.OrganizationNumber)}`}>
                    <span>virksomhetsnr. </span>
                    <span>{underenhet.OrganizationNumber}</span>
                </BodyShort>
            </div>
            {valgt && (
                <Success
                    aria-hidden={true}
                    className='navbm-virksomhetsvelger__underenhet-valgt-ikon'
                />
            )}
        </div>
    </Button>
);


type HovedenhetProps = {
    hovedenhet: Organisasjon;
    valgt: boolean;
    antallUnderenheter: number;
}

const Hovedenhet = ({hovedenhet, valgt, antallUnderenheter}: HovedenhetProps) =>
    <div className='navbm-virksomhetsvelger__enhet navbm-virksomhetsvelger__enhet--juridisk'>
        <div className='navbm-virksomhetsvelger__enhet-tekst'>
            <BodyShort className='navbm-virksomhetsvelger__enhet-tittel' aria-label={`Hovedenhet ${hovedenhet.Name}`}>
                {hovedenhet.Name}
            </BodyShort>
            <BodyShort>
                <span>org.nummer </span>
                <span aria-label={a11yOrgnr(hovedenhet.OrganizationNumber)}>{hovedenhet.OrganizationNumber}</span>
            </BodyShort>
            <BodyShort className='navbm-virksomhetsvelger__enhet-beskrivelse'
                       aria-label={`Hovedenheten har ${antallUnderenheter} ${antallUnderenheter === 1 ? 'underenhet' : 'underenheter'}`}>
                {antallUnderenheter} {antallUnderenheter === 1 ? 'underenhet' : 'underenheter'}
                {valgt ? ' - 1 valgt' : ''}
            </BodyShort>
        </div>
    </div>;


export default JuridiskEnhet;
