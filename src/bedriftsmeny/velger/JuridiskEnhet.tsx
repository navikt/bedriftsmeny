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
                    <div className='navbm-virksomhetsvelger__enhet navbm-virksomhetsvelger__enhet--juridisk'>
                        <div className='navbm-virksomhetsvelger__enhet-tekst'>
                            <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                                {JuridiskEnhet.Name}
                            </BodyShort>
                            <BodyShort>
                                <span>org.nummer </span>
                                <span>{JuridiskEnhet.OrganizationNumber}</span>
                            </BodyShort>
                            <BodyShort className='navbm-virksomhetsvelger__enhet-beskrivelse'>
                                {Underenheter.length} virksomhet
                                {Underenheter.length === 1 ? '' : 'er'}
                                {juridiskEnhetErValgt ? ' - 1 valgt' : ''}
                            </BodyShort>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <ul className='navbm-virksomhetsvelger__underenheter'>
                        {Underenheter.map((virksomhet) => {
                            const underenhetErValgt =
                                valgtOrganisasjon.OrganizationNumber ===
                                virksomhet.OrganizationNumber;

                            return (
                                <li key={virksomhet.OrganizationNumber}>
                                    <Button
                                        ref={underenhetErValgt ? ref : null}
                                        role='menuitemradio'
                                        aria-checked={underenhetErValgt}
                                        variant='tertiary'
                                        onClick={() => onUnderenhetClick(virksomhet)}
                                        className='navbm-virksomhetsvelger__underenhet-innhold'
                                    >
                                        <div className='navbm-virksomhetsvelger__enhet'>
                                            <Office1 aria-hidden={true} />
                                            <div className='navbm-virksomhetsvelger__enhet-tekst'>
                                                <BodyShort className='navbm-virksomhetsvelger__enhet-tittel'>
                                                    {virksomhet.Name}
                                                </BodyShort>
                                                <BodyShort>
                                                    <span>virksomhetsnr. </span>
                                                    <span>{virksomhet.OrganizationNumber}</span>
                                                </BodyShort>
                                            </div>
                                            {underenhetErValgt && (
                                                <Success
                                                    aria-hidden={true}
                                                    className='navbm-virksomhetsvelger__underenhet-valgt-ikon'
                                                />
                                            )}
                                        </div>
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </li>
    );
});

export default JuridiskEnhet;
