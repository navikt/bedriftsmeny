import React, {KeyboardEventHandler, useContext, useEffect, useRef, useState} from 'react';
import {Button, BodyShort, Search, Accordion, Detail} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {Expand, Collapse, Office1, Close} from '@navikt/ds-icons';
import {VirksomhetsvelgerContext} from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';
import Dropdown from "./Dropdown";
import FocusTrap from 'focus-trap-react';
import {a11yOrgnr} from "./utils";

const Velger = ({friKomponent} : {friKomponent: boolean} ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const valgtEnhetRef = useRef<HTMLButtonElement>(null);
    const [åpen, setÅpen] = useState<boolean>(false);

    const {
        velgUnderenhet,
        valgtOrganisasjon,
        aktivtOrganisasjonstre,
        søketekst,
        setSøketekst,
    } = useContext(VirksomhetsvelgerContext);
    const [fokusertEnhet, setFokusertEnhet] = useState<Organisasjon>(valgtOrganisasjon)
    const enheterflat = aktivtOrganisasjonstre.flatMap(({JuridiskEnhet, Underenheter }) => [JuridiskEnhet,...Underenheter]);
    const antallTreff = enheterflat.length;
    const gjørFørsteElementTabbable = søketekst.length > 0 && antallTreff > 0 && !enheterflat.some(({OrganizationNumber}) => OrganizationNumber === fokusertEnhet.OrganizationNumber);

    const onKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
        if (e.key === 'Home') {
            setFokusertEnhet(enheterflat[0])
            e.preventDefault()
        }

        if (e.key === 'End') {
            setFokusertEnhet(enheterflat[enheterflat.length - 1])
            e.preventDefault()
        }

        if (e.key === 'ArrowUp' || e.key === 'Up') {
            const index = enheterflat.findIndex(({OrganizationNumber}) => OrganizationNumber === fokusertEnhet.OrganizationNumber)
            const nextIndex = Math.max(0, index - 1)
            setFokusertEnhet(enheterflat[nextIndex])
            e.preventDefault()
        }

        if (e.key === 'ArrowDown' || e.key === 'Down') {
            const index = enheterflat.findIndex(({OrganizationNumber}) => OrganizationNumber === fokusertEnhet.OrganizationNumber)
            const nextIndex = Math.min(enheterflat.length - 1, index + 1)
            setFokusertEnhet(enheterflat[nextIndex])
            e.preventDefault()
        }
    };

    const onUnderenhetClick = (virksomhet: Organisasjon) => {
        setFokusertEnhet(virksomhet);
        velgUnderenhet(virksomhet.OrganizationNumber)
        setÅpen(false);
    };

    useEffect(() => {
        if (åpen) {
            valgtEnhetRef.current?.focus();
        } else {
            setSøketekst('')
            setFokusertEnhet(valgtOrganisasjon)
        }
    }, [åpen, fokusertEnhet]);
    useEffect(() => {
        setFokusertEnhet(valgtOrganisasjon)
    }, [valgtOrganisasjon]);

    return (
        <div className={`${friKomponent ? "navbm-virksomhetsvelger-fri-komponent" : ""}`}>
            <Button
                className="navbm-virksomhetsvelger"
                onClick={() => setÅpen((prev) => !prev)}
                type="button"
                variant="secondary"
                ref={buttonRef}
                aria-label={`Virksomhetsmeny. Valgt virksomhet er ${valgtOrganisasjon.Name} med virksomhetsnummer ${a11yOrgnr(valgtOrganisasjon.OrganizationNumber)}`}
                aria-controls="navbm-virksomhetsvelger-popup"
                aria-haspopup={true}
                aria-expanded={åpen}
            >
                <div className="navbm-virksomhetsvelger__innhold">
                    <div className="navbm-virksomhetsvelger__underenhet-ikon">
                        <Office1 aria-hidden={true}/>
                    </div>
                    <div className="navbm-virksomhetsvelger__tekst">
                        <BodyShort className="navbm-virksomhetsvelger__virksomhetsnavn">
                            {valgtOrganisasjon.Name}
                        </BodyShort>
                        <BodyShort>virksomhetsnr. {valgtOrganisasjon.OrganizationNumber}</BodyShort>
                    </div>
                    {åpen ? <Collapse style={{pointerEvents:"none"}} aria-hidden={true}/> : <Expand style={{pointerEvents:"none"}} aria-hidden={true}/>}
                </div>
            </Button>
            <Dropdown
                id="navbm-virksomhetsvelger-popup"
                ariaLabel="Virksomhetsvelger"
                friKomponent={friKomponent}
                erApen={åpen}
            >
                <FocusTrap
                    focusTrapOptions={{
                        clickOutsideDeactivates: e => {
                            if (buttonRef.current && e.target instanceof Node && buttonRef.current.contains(e.target)) {
                                /* Knappen flipper også `åpen`. Om vi også flipper, så flippes `åpen` fram og tilbake. */
                            } else {
                                setÅpen(false)
                            }
                            return true
                        },
                        escapeDeactivates: () => {
                            setÅpen(false)
                            return true;
                        },
                    }}
                >
                    <div
                        className="navbm-virksomhetsvelger__popup"
                        role="menu"
                    >
                        <div className="navbm-virksomhetsvelger__popup-header">
                            <Search
                                variant="simple"
                                value={søketekst}
                                onChange={setSøketekst}
                                clearButtonLabel="Tøm søkefelt"
                                placeholder="Søk på virksomhet ..."
                                label="Søk på virksomhet"
                                autoComplete="organization"
                                onKeyDown={(e) => {
                                    if (søketekst.length > 0 && enheterflat.length > 0) {
                                        if (e.key === 'ArrowDown' || e.key === 'Down') {
                                            setFokusertEnhet(enheterflat[0])
                                            e.preventDefault()
                                        }
                                    }
                                }}
                            />
                            <CloseButton onClick={() => setÅpen(false)} />
                        </div>
                        <Detail role="status" id="sokestatus">
                            {søketekst.length > 0 && (<>
                                    {antallTreff === 0 ? `Ingen treff på "${søketekst}"` : `${antallTreff} treff på "${søketekst}".`}
                            </>)}
                        </Detail>
                        <Accordion style={{display: "flex", overflow: "auto"}}
                                   id="virksomhetsvelger__resultatliste">
                            <ul
                                className="navbm-virksomhetsvelger__juridiske-enheter"
                                onKeyDown={onKeyDown}
                            >
                                {aktivtOrganisasjonstre.map((juridiskEnhet, i) => (
                                    <JuridiskEnhet
                                        forceTabbable={i === 0 && gjørFørsteElementTabbable}
                                        enhetRef={valgtEnhetRef}
                                        key={juridiskEnhet.JuridiskEnhet.OrganizationNumber}
                                        juridiskEnhet={juridiskEnhet}
                                        fokusertEnhet={fokusertEnhet}
                                        onUnderenhetClick={onUnderenhetClick}
                                    />
                                ))}
                            </ul>
                        </Accordion>
                    </div>
                </FocusTrap>
            </Dropdown>
        </div>
    );
};


type CloseButtonProps = {
    onClick: () => void;
}
const CloseButton = ({onClick}: CloseButtonProps) =>
    <Button
        variant="tertiary"
        aria-label="lukk virksomhetsvelger"
        className="navbm-virksomhetsvelger__popup-header-xbtn"
        onClick={onClick}
    >
        <Close aria-hidden={true}/>
    </Button>

export default Velger;
