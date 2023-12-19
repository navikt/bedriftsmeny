import React, {useContext, useEffect, useRef, useState} from 'react';
import {Accordion, BodyShort, Button, Detail, Search} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {Close, Collapse, Expand, Office1} from '@navikt/ds-icons';
import {VirksomhetsvelgerContext} from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';
import Dropdown from "./Dropdown";
import FocusTrap from 'focus-trap-react';
import {a11yOrgnr} from "./utils";
import {useTastaturNavigasjon} from "./useTastaturNavigasjon";


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
    const {
        fokusertEnhet,
        organisasjonerMedState,
        fokuserFørsteEnhet,
        fokuserSisteEnhet,
        pilOpp,
        pilNed,
        pilHøyre,
        pilVenstre,
        toggleEkspander,
        fokuserEnhet,
        resetState,
    } = useTastaturNavigasjon();
    const antallTreff = organisasjonerMedState.length;

    useEffect(() => {
        if (åpen) {
            valgtEnhetRef.current?.focus();
        } else {
            setSøketekst('')
            resetState()
        }
    }, [åpen, fokusertEnhet.OrganizationNumber]);

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
                                    if (e.key === 'ArrowDown' || e.key === 'Down') {
                                        fokuserFørsteEnhet()
                                        e.preventDefault()
                                    }
                                }}
                            />
                            <CloseButton onClick={() => setÅpen(false)} />
                        </div>
                        <Detail role="status">
                            {søketekst.length > 0 && (<>
                                    {antallTreff === 0 ? `Ingen treff på "${søketekst}"` : `${antallTreff} treff på "${søketekst}".`}
                            </>)}
                        </Detail>
                        <Accordion style={{display: "flex", overflow: "auto"}}>
                            <ul
                                className="navbm-virksomhetsvelger__juridiske-enheter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Home') {
                                        fokuserFørsteEnhet();
                                        e.preventDefault()
                                    }

                                    if (e.key === 'End') {
                                        fokuserSisteEnhet();
                                        e.preventDefault()
                                    }

                                    if (e.key === 'ArrowUp' || e.key === 'Up') {
                                        pilOpp();
                                        e.preventDefault()
                                    }

                                    if (e.key === 'ArrowDown' || e.key === 'Down') {
                                        pilNed();
                                        e.preventDefault()
                                    }

                                    if (e.key === 'ArrowRight' || e.key === 'Right') {
                                        pilHøyre();
                                        e.preventDefault()
                                    }

                                    if (e.key === 'ArrowLeft' || e.key === 'Left') {
                                        pilVenstre();
                                        e.preventDefault()
                                    }
                                }}
                            >
                                {aktivtOrganisasjonstre.map(({JuridiskEnhet: HovedEnhet, Underenheter}) => {
                                    const flatSubtreMedState = organisasjonerMedState.filter(
                                        ({OrganizationNumber}) =>
                                            OrganizationNumber === HovedEnhet.OrganizationNumber
                                            || Underenheter.some((underenhet) => OrganizationNumber === underenhet.OrganizationNumber)
                                    );
                                    return (
                                        <JuridiskEnhet
                                            enhetRef={valgtEnhetRef}
                                            key={HovedEnhet.OrganizationNumber}
                                            organisasjonerMedState={flatSubtreMedState}
                                            onUnderenhetClick={(virksomhet: Organisasjon) => {
                                                velgUnderenhet(virksomhet.OrganizationNumber);
                                                setÅpen(false);
                                            }}
                                            onHovedenhetClick={(hovedenhet: Organisasjon) => {
                                                toggleEkspander(hovedenhet)
                                            }}
                                            onFocus={(enhet: Organisasjon) => {
                                                fokuserEnhet(enhet)
                                            }}
                                        />
                                    );
                                })}
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
