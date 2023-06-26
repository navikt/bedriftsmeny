import React, { forwardRef, useState } from 'react';
import { Office1, Success } from '@navikt/ds-icons';
import { Accordion, BodyShort, Button } from '@navikt/ds-react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../organisasjon';

type Props = {
    juridiskEnhet: JuridiskEnhetMedUnderEnheterArray;
    valgtOrganisasjon: Organisasjon;
    onUnderenhetClick: (underenhet: Organisasjon) => void;
};

const JuridiskEnhet = forwardRef<HTMLButtonElement, Props>(({
                                                                juridiskEnhet,
                                                                valgtOrganisasjon,
                                                                onUnderenhetClick
                                                            }, ref) => {
    const { JuridiskEnhet, Underenheter } = juridiskEnhet;

    const juridiskEnhetErValgt = Underenheter.some(
        (enhet: Organisasjon) => enhet.OrganizationNumber === valgtOrganisasjon.OrganizationNumber
    );
    const [open, setOpen] = useState(juridiskEnhetErValgt);

    return (
        <li className='navbm-virksomhetsvelger__juridisk-enhet'>
            <Accordion.Item open={open}>
                <Accordion.Header
                    onClick={() => {
                        setOpen(!open);
                    }}
                    style={{backgroundColor: open ? 'var(--a-surface-action-subtle' : 'transparent'}}
                >
                    <Hovedenhet
                        hovedenhet={JuridiskEnhet}
                        valgt={juridiskEnhetErValgt}
                        antallUnderenheter={Underenheter.length}
                    />
                </Accordion.Header>
                <Accordion.Content>
                    <ul className='navbm-virksomhetsvelger__underenheter'>
                        {Underenheter.map((virksomhet) => {
                            const underenhetErValgt =
                                valgtOrganisasjon.OrganizationNumber ===
                                virksomhet.OrganizationNumber;

                            return (
                                <li key={virksomhet.OrganizationNumber}>
                                    <Underenhet
                                        underenhet={virksomhet}
                                        valgt={underenhetErValgt}
                                        ref={underenhetErValgt ? ref : null}
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
});

type UnderenhetProps = {
    valgt: boolean;
    onClick: (underenhet: Organisasjon) => void;
    underenhet: Organisasjon;
}

const Underenhet = forwardRef<HTMLButtonElement, UnderenhetProps>(({valgt, onClick, underenhet}, ref) =>
    <Button
        ref={ref}
        role='menuitemradio'
        aria-checked={valgt}
        variant='tertiary'
        onClick={() => onClick(underenhet)}
        className='navbm-virksomhetsvelger__underenhet-innhold'
    >
        <div className='navbm-virksomhetsvelger__enhet'>
            <Office1 aria-hidden={true} />
            <div className='navbm-virksomhetsvelger__enhet-tekst'>
                <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                    {underenhet.Name}
                </BodyShort>
                <BodyShort>
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
            <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                {hovedenhet.Name}
            </BodyShort>
            <BodyShort>
                <span>org.nummer </span>
                <span>{hovedenhet.OrganizationNumber}</span>
            </BodyShort>
            <BodyShort className='navbm-virksomhetsvelger__enhet-beskrivelse'>
                {antallUnderenheter} virksomhet
                {antallUnderenheter === 1 ? '' : 'er'}
                {valgt ? ' - 1 valgt' : ''}
            </BodyShort>
        </div>
    </div>;


export default JuridiskEnhet;
