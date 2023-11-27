import React, {KeyboardEventHandler, useContext, useEffect, useRef, useState} from 'react';
import {Button,  Heading, BodyShort, Search, Accordion, Detail} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {Expand, Collapse, Office1, Close} from '@navikt/ds-icons';
import {VirksomhetsvelgerContext} from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';
import Dropdown from "./Dropdown";
import FocusTrap from 'focus-trap-react';

const Velger = ({friKomponent} : {friKomponent: boolean} ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const valgtUnderenhetRef = useRef<HTMLButtonElement>(null);
    const [åpen, setÅpen] = useState<boolean>(false);

    const {
        velgUnderenhet,
        valgtOrganisasjon,
        aktivtOrganisasjonstre,
        søketekst,
        setSøketekst,
    } = useContext(VirksomhetsvelgerContext);
    const [fokusertUnderenhet, setFokusertUnderenhet] = useState(valgtOrganisasjon)
    const underenheterFlat = aktivtOrganisasjonstre.flatMap(({Underenheter }) => [...Underenheter]);
    const antallTreff = underenheterFlat.length;

    const onKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
        if (e.key === 'Home') {
            setFokusertUnderenhet(underenheterFlat[0])
            e.preventDefault()
        }

        if (e.key === 'End') {
            setFokusertUnderenhet(underenheterFlat[underenheterFlat.length - 1])
            e.preventDefault()
        }

        if (e.key === 'ArrowUp' || e.key === 'Up') {
            const index = underenheterFlat.findIndex(({OrganizationNumber}) => OrganizationNumber === fokusertUnderenhet.OrganizationNumber)
            const nextIndex = Math.max(0, index - 1)
            setFokusertUnderenhet(underenheterFlat[nextIndex])
            e.preventDefault()
        }

        if (e.key === 'ArrowDown' || e.key === 'Down') {
            const index = underenheterFlat.findIndex(({OrganizationNumber}) => OrganizationNumber === fokusertUnderenhet.OrganizationNumber)
            const nextIndex = Math.min(underenheterFlat.length - 1, index + 1)
            setFokusertUnderenhet(underenheterFlat[nextIndex])
            e.preventDefault()
        }
    };

    const toggleVelger = (verdi?: boolean) => {
        setÅpen(verdi === undefined ? !åpen : verdi);
    };

    const onUnderenhetClick = (virksomhet: Organisasjon) => {
        setFokusertUnderenhet(virksomhet);
        velgUnderenhet(virksomhet.OrganizationNumber)
        setÅpen(false);
    };

    useEffect(() => {
        if (åpen) {
            valgtUnderenhetRef.current?.focus();
        } else {
            setSøketekst('')
        }
    }, [åpen, fokusertUnderenhet]);

    return (
        <div className={`${friKomponent ? "navbm-virksomhetsvelger-fri-komponent" : ""}`}>
            <Button
                className="navbm-virksomhetsvelger"
                onClick={() => toggleVelger()}
                type="button"
                variant="secondary"
                ref={buttonRef}
                aria-label="Velg aktiv virksomhet"
                aria-controls="navbm-virksomhetsvelger-popup"
                aria-haspopup={true}
                aria-expanded={åpen}
            >
                <div className="navbm-virksomhetsvelger__innhold">
                    <div className="navbm-virksomhetsvelger__underenhet-ikon">
                        <Office1 aria-hidden={true}/>
                    </div>
                    <div className="navbm-virksomhetsvelger__tekst">
                        <Heading size="small" level="2">
                            {valgtOrganisasjon.Name}
                        </Heading>
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
                                placeholder="Søk på virksomhet ..."
                                label="Søk på virksomhet"
                            />
                            <CloseButton onClick={() => setÅpen(false)} />
                        </div>
                        {søketekst.length > 0 && (
                            <Detail role="status">
                                {antallTreff === 0 ? 'Ingen' : antallTreff} treff på "{søketekst}"
                            </Detail>
                        )}
                        <Accordion style={{display: "flex", overflow: "auto"}}>
                            <ul
                                className="navbm-virksomhetsvelger__juridiske-enheter"
                                onKeyDown={onKeyDown}
                            >
                                {aktivtOrganisasjonstre.map((juridiskEnhet) => (
                                    <JuridiskEnhet
                                        ref={valgtUnderenhetRef}
                                        key={juridiskEnhet.JuridiskEnhet.OrganizationNumber + fokusertUnderenhet.OrganizationNumber}
                                        juridiskEnhet={juridiskEnhet}
                                        valgtOrganisasjon={fokusertUnderenhet}
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
        aria-label="lukk"
        className="navbm-virksomhetsvelger__popup-header-xbtn"
        onClick={onClick}
    >
        <Close aria-hidden={true}/>
    </Button>

export default Velger;
