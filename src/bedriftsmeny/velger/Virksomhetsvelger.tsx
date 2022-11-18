import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Popover, Heading, BodyShort, Search, Accordion, Detail } from '@navikt/ds-react';
import { Organisasjon } from '../organisasjon';
import { Expand, Collapse, Office1 } from '@navikt/ds-icons';
import { VirksomhetsvelgerContext } from './VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';

const Velger = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
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

    const onUnderenhetClick = (virksomhet: Organisasjon) => {
        velgUnderenhet(virksomhet.OrganizationNumber);
        setÅpen(false);
    };

    useEffect(() => {
        if (åpen) {
            searchRef.current?.focus();
        }
    }, [åpen]);

    const antallTreff = aktivtOrganisasjonstre.reduce(
        (totaltAntall, juridiskEnhet) => totaltAntall + juridiskEnhet.Underenheter.length,
        0
    );

    return (
        <>
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
                    <Office1 aria-hidden={true} />
                    <div className="navbm-virksomhetsvelger__tekst">
                        <Heading size="small" level="2">
                            {valgtOrganisasjon.Name}
                        </Heading>
                        <BodyShort>virksomhetsnr. {valgtOrganisasjon.OrganizationNumber}</BodyShort>
                    </div>
                    {åpen ? <Collapse aria-hidden={true} /> : <Expand aria-hidden={true} />}
                </div>
            </Button>
            {åpen && <Popover
                offset={24}
                open={åpen}
                onClose={() => setÅpen(false)}
                anchorEl={buttonRef.current}
                placement="bottom-start"
                id="navbm-virksomhetsvelger-popup"
            >
                <div className="navbm-virksomhetsvelger__popup" role="menu">
                    <Search
                        ref={searchRef}
                        variant="simple"
                        value={søketekst}
                        onChange={setSøketekst}
                        placeholder="Søk på virksomhet ..."
                        label="Søk på virksomhet"
                    />
                    {søketekst.length > 0 && (
                        <Detail aria-live="polite">
                            {antallTreff === 0 ? 'Ingen' : antallTreff} treff på "{søketekst}"
                        </Detail>
                    )}
                    <Accordion>
                        <ul
                            className="navbm-virksomhetsvelger__juridiske-enheter"
                        >
                            {aktivtOrganisasjonstre.map((juridiskEnhet) => (
                                <JuridiskEnhet
                                    key={juridiskEnhet.JuridiskEnhet.OrganizationNumber}
                                    juridiskEnhet={juridiskEnhet}
                                    valgtOrganisasjon={valgtOrganisasjon}
                                    onUnderenhetClick={onUnderenhetClick}
                                />
                            ))}
                        </ul>
                    </Accordion>
                </div>
            </Popover>}
        </>
    );
};

export default Velger;
