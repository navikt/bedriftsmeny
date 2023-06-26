import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button,  Heading, BodyShort, Search, Accordion, Detail} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {Expand, Collapse, Office1, Close} from '@navikt/ds-icons';
import {VirksomhetsvelgerContext} from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';
import Dropdown from "./Dropdown";
import {Props} from "react-modal";

export const useKeyboardEvent = (type: 'keydown' | 'keypress' | 'keyup', containerRef: React.RefObject<HTMLElement>, handler: (event: KeyboardEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            const node = containerRef.current
            if (node === null) {
                return
            }

            if (node !== event.target && !node.contains(event.target as HTMLElement)) {
                return
            }

            handler(event);
        };
        document.addEventListener(type, listener);
        return () => {
            document.removeEventListener(type, listener);
        };
    }, [type, containerRef, handler]);
}

const Velger = ({friKomponent} : {friKomponent: boolean} ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const lukkKnappRef = useRef<HTMLButtonElement>(null);
    const søkefeltRef = useRef<HTMLInputElement>(null);
    const listeRef = useRef<HTMLUListElement>(null);
    const valgtUnderenhetRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

    useKeyboardEvent('keydown', listeRef, (e) => {
        console.log("key down 1")
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                lukkKnappRef.current?.focus()
            } else {
                søkefeltRef.current?.focus()
            }
            e.preventDefault()
        }

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

    });

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

    const handleClickOutside: { (event: MouseEvent | KeyboardEvent): void } = (
        e: MouseEvent | KeyboardEvent
    ) => {
        const node = dropdownRef.current
        // @ts-ignore
        if (node && node !== e.target && node.contains(e.target as HTMLOrSVGElement)) {
            return
        }
        // @ts-ignore
        if (!document.contains(e.target as HTMLOrSVGElement)){
            return
            //Clear-knapp i søkefeltet forsvinner når klikket på.
            //Dette blir derfor registrert som klikk utenfor dropdown-menyen.
        }
        setÅpen(false)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [handleClickOutside])


    return (
        <div ref={dropdownRef} className={`${friKomponent ? "navbm-virksomhetsvelger-fri-komponent" : ""}`}>
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
                ariaLabel="Virksomhetsvelger"
                friKomponent={friKomponent}
                erApen={åpen}
            >
                <div
                    className="navbm-virksomhetsvelger__popup"
                    role="menu"
                    onKeyDown={({key}) => {
                        if (key === 'Escape' || key === 'Esc') {
                            setÅpen(false)
                        }
                    }}
                >
                    <div className="navbm-virksomhetsvelger__popup-header">
                        <Search
                            ref={søkefeltRef}
                            variant="simple"
                            value={søketekst}
                            onChange={setSøketekst}
                            placeholder="Søk på virksomhet ..."
                            label="Søk på virksomhet"
                            onKeyDown={(e) => {
                                if (e.key === 'Tab' && e.shiftKey) {
                                    if (underenheterFlat.some(({OrganizationNumber}) => OrganizationNumber === fokusertUnderenhet.OrganizationNumber)) {
                                        valgtUnderenhetRef.current?.focus()
                                    } else {
                                        setFokusertUnderenhet(underenheterFlat[0])
                                    }
                                    e.preventDefault()
                                }
                            }}
                        />
                        <Button
                            ref={lukkKnappRef}
                            variant="tertiary"
                            aria-label="lukk"
                            className="navbm-virksomhetsvelger__popup-header-xbtn"
                            onClick={() => setÅpen(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Tab' && !e.shiftKey) {
                                    if (underenheterFlat.some(({OrganizationNumber}) => OrganizationNumber === fokusertUnderenhet.OrganizationNumber)) {
                                        valgtUnderenhetRef.current?.focus()
                                    } else {
                                        setFokusertUnderenhet(underenheterFlat[0])
                                    }
                                    e.preventDefault()
                                }
                            }}
                        >
                            <Close aria-hidden={true}/>
                        </Button>
                    </div>
                    {søketekst.length > 0 && (
                        <Detail role="status">
                            {antallTreff === 0 ? 'Ingen' : antallTreff} treff på "{søketekst}"
                        </Detail>
                    )}
                    <Accordion style={{display: "flex", overflow: "auto"}}>
                        <ul
                            className="navbm-virksomhetsvelger__juridiske-enheter"
                            ref={listeRef}
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
            </Dropdown>
        </div>
    );
};

export default Velger;
