import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Popover, Heading, BodyShort, Search, Accordion, Detail } from '@navikt/ds-react';
import { Organisasjon } from '../organisasjon';
import { Office2, Expand, Collapse } from '@navikt/ds-icons';
import { VirksomhetsvelgerContext } from '../Virksomhetsvelger/VirksomhetsvelgerProvider';
import JuridiskEnhet from './JuridiskEnhet';

type Props = {
    onOrganisasjonChange?: (organisasjon: Organisasjon) => void;
};

const Velger: FunctionComponent<Props> = ({ onOrganisasjonChange }) => {
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
        if (onOrganisasjonChange) {
            virksomhet;
        }

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
                className="bedriftsmenyknapp"
                onClick={() => toggleVelger()}
                type="button"
                variant="secondary"
                ref={buttonRef}
                role="menubutton"
                aria-label="Velg aktiv virksomhet"
                aria-controls="bedriftsvelger-popup"
                aria-haspopup={true}
                aria-expanded={åpen}
            >
                <div className="bedriftsmenyknapp__innhold">
                    <Office2 aria-hidden={true} />
                    <div className="bedriftsmenyknapp__tekst">
                        <Heading size="small" level="2">
                            {valgtOrganisasjon.Name}
                        </Heading>
                        <BodyShort>virksomhetsnr. {valgtOrganisasjon.OrganizationNumber}</BodyShort>
                    </div>
                    {åpen ? <Collapse aria-hidden={true} /> : <Expand aria-hidden={true} />}
                </div>
            </Button>
            <Popover
                offset={24}
                open={åpen}
                onClose={() => setÅpen(false)}
                anchorEl={buttonRef.current}
                placement="bottom-start"
                id="bedriftsvelger-popup"
            >
                <div className="velgerinnhold" role="menu">
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
                        <ul role="presentation" className="velgerinnhold__liste">
                            {aktivtOrganisasjonstre.map((juridiskEnhet) => (
                                <JuridiskEnhet
                                    juridiskEnhet={juridiskEnhet}
                                    valgtOrganisasjon={valgtOrganisasjon}
                                    onUnderenhetClick={onUnderenhetClick}
                                />
                            ))}
                        </ul>
                    </Accordion>
                </div>
            </Popover>
        </>
    );
};

export default Velger;
