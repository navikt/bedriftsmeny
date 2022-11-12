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
        velgUnderenhet(virksomhet.OrganizationNumber);
        setÅpen(false);
    };

    return (
        <>
            <Button
                className="velgerknapp__container"
                onClick={toggleVelger}
                type="button"
                variant="secondary"
                ref={buttonRef}
            >
                <div className="velgerknapp">
                    <Office2 className="velgerknapp--ikon" aria-hidden={true} />
                    <div className="velgerknapp--tekst">
                        <Heading size="small" level="2">
                            {valgtOrganisasjon.Name}
                        </Heading>
                        <BodyShort>virksomhetsnr. {valgtOrganisasjon.OrganizationNumber}</BodyShort>
                    </div>
                    {åpen ? (
                        <Collapse className="velgerknapp--ikon" aria-hidden={true} />
                    ) : (
                        <Expand className="velgerknapp--ikon" aria-hidden={true} />
                    )}
                </div>
            </Button>
            <Popover
                offset={24}
                open={åpen}
                onClose={() => setÅpen(false)}
                anchorEl={buttonRef.current}
                placement="bottom-start"
            >
                <div className="velgerinnhold">
                    <Search
                        ref={searchRef}
                        variant="simple"
                        value={søketekst}
                        onChange={setSøketekst}
                        placeholder="Søk på virksomhet ..."
                        label="Søk på virksomhet"
                    />
                    <Accordion>
                        {aktivtOrganisasjonstre.map((organisasjon) => (
                            <Accordion.Item
                                className="juridisk-enhet"
                                key={organisasjon.JuridiskEnhet.OrganizationNumber}
                            >
                                <Accordion.Header>
                                    <div className="juridisk-enhet--innhold">
                                        <Office1 aria-hidden={true} />
                                        <div className="juridisk-enhet--tekst">
                                            <BodyShort className="juridisk-enhet--tittel">
                                                {organisasjon.JuridiskEnhet.Name}
                                            </BodyShort>
                                            <BodyShort className="juridisk-enhet--orgnummer">
                                                <span>org.nummer </span>
                                                <span>
                                                    {organisasjon.JuridiskEnhet.OrganizationNumber}
                                                </span>
                                            </BodyShort>
                                            <BodyShort>
                                                {organisasjon.Underenheter.length} virksomhet
                                                {organisasjon.Underenheter.length === 1 ? '' : 'er'}
                                            </BodyShort>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Content className="juridisk-enhet--virksomheter">
                                    {organisasjon.Underenheter.map((virksomhet) => (
                                        <Button
                                            variant="tertiary"
                                            onClick={onUnderenhetClick(virksomhet)}
                                            className="virksomhet--knapp"
                                        >
                                            <div className="virksomhet">
                                                <Office2 aria-hidden={true} />
                                                <div className="juridisk-enhet--tekst">
                                                    <BodyShort className="juridisk-enhet--tittel">
                                                        {virksomhet.Name}
                                                    </BodyShort>
                                                    <BodyShort className="juridisk-enhet--orgnummer">
                                                        <span>virksomhetsnr. </span>
                                                        <span>{virksomhet.OrganizationNumber}</span>
                                                    </BodyShort>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </Popover>
        </>
    );
};

export default Velger;
