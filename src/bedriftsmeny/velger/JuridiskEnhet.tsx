import React, {ForwardedRef, forwardRef} from 'react';
import { Office2, Success } from '@navikt/ds-icons';
import {Accordion, BodyShort, Button} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {OrganisasjonMedState} from "./useTastaturNavigasjon";

type Props = {
    organisasjonerMedState: OrganisasjonMedState[];
    onUnderenhetClick: (underenhet: Organisasjon) => void;
    onHovedenhetClick: (hovedenhet: Organisasjon) => void;
    onFocus: (enhet: Organisasjon) => void;
    enhetRef: ForwardedRef<HTMLButtonElement>;
};

const JuridiskEnhet = (
    {
        organisasjonerMedState,
        onUnderenhetClick,
        onHovedenhetClick,
        enhetRef,
        onFocus,
    }: Props
) => {
    const [juridiskEnhet, ...underenheter] = organisasjonerMedState;

    const valgt = organisasjonerMedState.some(({valgt}) => valgt);
    return juridiskEnhet && (
        <li className='navbm-virksomhetsvelger__juridisk-enhet'>
            <Accordion.Item open={juridiskEnhet.ekspandert} role="group">
                <Accordion.Header
                    tabIndex={valgt ? 0 : -1}
                    ref={juridiskEnhet.fokusert ? enhetRef : null}
                    onClick={() => {
                        onHovedenhetClick(juridiskEnhet);
                    }}
                    onFocus={() => {
                        if (!juridiskEnhet.fokusert) {
                            onFocus(juridiskEnhet)
                        }
                    }}
                    aria-owns={`underenheter-${juridiskEnhet.OrganizationNumber}`}
                    style={{backgroundColor: juridiskEnhet.ekspandert ? 'var(--a-surface-action-subtle' : 'transparent'}}
                >
                    <Hovedenhet
                        hovedenhet={juridiskEnhet}
                        valgt={valgt}
                        antallUnderenheter={underenheter.length}
                    />
                </Accordion.Header>
                <Accordion.Content>
                    <ul className='navbm-virksomhetsvelger__underenheter'
                        id={`underenheter-${juridiskEnhet.OrganizationNumber}`}>
                        {underenheter.map((underenhetMedState) => {
                            return (
                                <li key={underenhetMedState.OrganizationNumber}>
                                    <Underenhet
                                        underenhet={underenhetMedState}
                                        valgt={underenhetMedState.valgt}
                                        ref={underenhetMedState.fokusert ? enhetRef : null}
                                        onClick={onUnderenhetClick}
                                        onFocus={() => {
                                            if (!underenhetMedState.fokusert) {
                                                onFocus(underenhetMedState)
                                            }
                                        }}
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
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
    underenhet: Organisasjon;
}

const Underenhet = forwardRef<HTMLButtonElement, UnderenhetProps>(({valgt, onClick, underenhet, onFocus}, ref) =>
    <Button
        type="button"
        ref={ref}
        tabIndex={valgt ? 0 : -1}
        aria-pressed={valgt}
        variant='tertiary'
        onClick={() => onClick(underenhet)}
        onFocus={onFocus}
        className='navbm-virksomhetsvelger__underenhet-innhold'
    >
        <div className='navbm-virksomhetsvelger__enhet'>
            <div className='navbm-virksomhetsvelger__enhet-tekst'>
                <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                    {underenhet.Name}
                </BodyShort>
                <BodyShort>
                    <span>Org.nr </span>
                    <span>{underenhet.OrganizationNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
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
            <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                {hovedenhet.Name}
            </BodyShort>
            <BodyShort>
                <span>Org.nr. </span>
                <span>{hovedenhet.OrganizationNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
            </BodyShort>
            <BodyShort className='navbm-virksomhetsvelger__enhet-beskrivelse'
                       aria-label={`Hovedenheten har ${antallUnderenheter} ${antallUnderenheter === 1 ? 'underenhet' : 'underenheter'}`}>
                {antallUnderenheter} {antallUnderenheter === 1 ? 'underenhet' : 'underenheter'}
                {valgt ? ' - 1 valgt' : ''}
            </BodyShort>
        </div>
    </div>;


export default JuridiskEnhet;
