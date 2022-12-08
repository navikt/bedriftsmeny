import React, {FunctionComponent, useContext, useEffect, useRef, useState} from 'react';
import {Button, Popover, Heading, BodyShort, Search, Accordion, Detail} from '@navikt/ds-react';
import {Organisasjon} from '../organisasjon';
import {Expand, Collapse, Office1, Close} from '@navikt/ds-icons';
import {VirksomhetsvelgerContext} from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';
import Dropdown from "./Dropdown";

const Velger = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
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

    const toggleVelger = (verdi?: boolean) => {
        setÅpen(verdi === undefined ? !åpen : verdi);
    };

    const lukkDropdown = () => {
        toggleVelger(false);
    }

    const onUnderenhetClick = (virksomhet: Organisasjon) => {
        velgUnderenhet(virksomhet.OrganizationNumber);
        setÅpen(false);
    };

    useEffect(() => {
        if (åpen) {
            valgtUnderenhetRef.current?.focus();
        }
    }, [åpen]);

    const antallTreff = aktivtOrganisasjonstre.reduce(
        (totaltAntall, juridiskEnhet) => totaltAntall + juridiskEnhet.Underenheter.length,
        0
    );


    const handleFocusOutside: { (event: MouseEvent | KeyboardEvent): void } = (
        e: MouseEvent | KeyboardEvent
    ) => {
        const node = dropdownRef.current
        // @ts-ignore
        if (node && node !== e.target && node.contains(e.target as HTMLOrSVGElement)) {
            return
        }
        console.log(e.target)
        lukkDropdown()
    }

    useEffect(() => {
        document.addEventListener('click', handleFocusOutside)
        return () => {
            document.removeEventListener('click', handleFocusOutside)
        }
    }, [handleFocusOutside])


    return (
        <div ref={dropdownRef}>
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
                ariaLabelledby={"navbm-virksomhetsvelger__popup"}
                erApen={åpen}
            >
                <div
                    className="navbm-virksomhetsvelger__popup"
                    role="menu"
                    onKeyDown={({key}) => {
                        if (key === 'Escape' || key === 'Esc') {
                            toggleVelger()
                        }
                    }}
                >
                    <div className="navbm-virksomhetsvelger__popup-header">
                        <Search
                            variant="simple"
                            value={søketekst}
                            onChange={setSøketekst}
                            placeholder="Søk på virksomhet ..."
                            label="Søk på virksomhet"
                        />
                        <Button
                            variant="tertiary"
                            className="navbm-virksomhetsvelger__popup-header-xbtn"
                            onClick={()=>toggleVelger()}
                        >
                            <Close/>
                        </Button>
                    </div>
                    {søketekst.length > 0 && (
                        <Detail aria-live="polite">
                            {antallTreff === 0 ? 'Ingen' : antallTreff} treff på "{søketekst}"
                        </Detail>
                    )}
                    <Accordion style={{display: "flex", overflow: "auto"}}>
                        <ul
                            className="navbm-virksomhetsvelger__juridiske-enheter"
                        >
                            {aktivtOrganisasjonstre.map((juridiskEnhet) => (
                                <JuridiskEnhet
                                    ref={valgtUnderenhetRef}
                                    key={juridiskEnhet.JuridiskEnhet.OrganizationNumber}
                                    juridiskEnhet={juridiskEnhet}
                                    valgtOrganisasjon={valgtOrganisasjon}
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
