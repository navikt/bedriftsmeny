import React, { FunctionComponent, useContext, useRef, useState } from 'react';
import { Button, Popover, Heading, BodyShort, Search, Accordion, Label } from '@navikt/ds-react';
import { Organisasjon } from '../organisasjon';
import { Office1, Office2, Expand, Collapse } from '@navikt/ds-icons';
import { VirksomhetsvelgerContext } from '../Virksomhetsvelger/VirksomhetsvelgerProvider';

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

    const toggleVelger = () => {
        if (åpen) {
            setÅpen(false);
        } else {
            setÅpen(true);
            searchRef.current?.focus();
        }
    };

    const onUnderenhetClick = (virksomhet: Organisasjon) => () => {
        if (onOrganisasjonChange) {
            virksomhet;
        }

        velgUnderenhet(virksomhet.OrganizationNumber);
        setÅpen(false);
    };

    return (
        <>
            <Button
                className="bedriftsmenyknapp"
                onClick={toggleVelger}
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
                    <Accordion>
                        <ul role="presentation" className="velgerinnhold__liste">
                            {aktivtOrganisasjonstre.map((organisasjon) => (
                                <li role="menuitem" className="juridisk-enhet">
                                    <Accordion.Item
                                        key={organisasjon.JuridiskEnhet.OrganizationNumber}
                                    >
                                        <Accordion.Header>
                                            <div className="juridisk-enhet__innhold">
                                                <Office1 aria-hidden={true} />
                                                <div className="juridisk-enhet__tekst">
                                                    <BodyShort className="juridisk-enhet__tittel">
                                                        {organisasjon.JuridiskEnhet.Name}
                                                    </BodyShort>
                                                    <BodyShort>
                                                        <span>org.nummer </span>
                                                        <span>
                                                            {
                                                                organisasjon.JuridiskEnhet
                                                                    .OrganizationNumber
                                                            }
                                                        </span>
                                                    </BodyShort>
                                                    <BodyShort className="juridisk-enhet__antall-virksomheter">
                                                        {organisasjon.Underenheter.length}{' '}
                                                        virksomhet
                                                        {organisasjon.Underenheter.length === 1
                                                            ? ''
                                                            : 'er'}
                                                    </BodyShort>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Content className="juridisk-enhet__virksomheter">
                                            {organisasjon.Underenheter.map((virksomhet) => (
                                                <Button
                                                    variant="tertiary"
                                                    onClick={onUnderenhetClick(virksomhet)}
                                                    className="virksomhetsknapp"
                                                >
                                                    <div className="virksomhetsknapp__innhold">
                                                        <Office2 aria-hidden={true} />
                                                        <div className="juridisk-enhet__tekst">
                                                            <BodyShort className="juridisk-enhet__tittel">
                                                                {virksomhet.Name}
                                                            </BodyShort>
                                                            <BodyShort>
                                                                <span>virksomhetsnr. </span>
                                                                <span>
                                                                    {virksomhet.OrganizationNumber}
                                                                </span>
                                                            </BodyShort>
                                                        </div>
                                                    </div>
                                                </Button>
                                            ))}
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </li>
                            ))}
                        </ul>
                    </Accordion>
                </div>
            </Popover>
        </>
    );
};

export default Velger;
