import React, { FunctionComponent } from 'react';
import { Office1, Office2, Success } from '@navikt/ds-icons';
import { Accordion, BodyShort, Button } from '@navikt/ds-react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../organisasjon';

type Props = {
    juridiskEnhet: JuridiskEnhetMedUnderEnheterArray;
    valgtOrganisasjon: Organisasjon;
    onUnderenhetClick: (underenhet: Organisasjon) => void;
};

const JuridiskEnhet: FunctionComponent<Props> = ({
    juridiskEnhet,
    valgtOrganisasjon,
    onUnderenhetClick,
}) => {
    const { JuridiskEnhet, Underenheter } = juridiskEnhet;

    return (
        <li className="juridisk-enhet">
            <Accordion.Item
                key={JuridiskEnhet.OrganizationNumber}
                defaultOpen={Underenheter.some(
                    (enhet: Organisasjon) =>
                        enhet.OrganizationNumber === valgtOrganisasjon.OrganizationNumber
                )}
            >
                <Accordion.Header>
                    <div className="juridisk-enhet__innhold">
                        <Office1 aria-hidden={true} />
                        <div className="juridisk-enhet__tekst">
                            <BodyShort className="juridisk-enhet__tittel">
                                {JuridiskEnhet.Name}
                            </BodyShort>
                            <BodyShort>
                                <span>org.nummer </span>
                                <span>{JuridiskEnhet.OrganizationNumber}</span>
                            </BodyShort>
                            <BodyShort className="juridisk-enhet__antall-virksomheter">
                                {Underenheter.length} virksomhet
                                {Underenheter.length === 1 ? '' : 'er'}
                            </BodyShort>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content className="juridisk-enhet__virksomheter">
                    <ul role="presentation" className="juridisk-enhet__virksomhetsliste">
                        {Underenheter.map((virksomhet) => (
                            <li
                                className="virksomhet"
                                role="menuitem"
                                aria-selected={
                                    valgtOrganisasjon.OrganizationNumber ===
                                    virksomhet.OrganizationNumber
                                }
                            >
                                <Button
                                    variant="tertiary"
                                    onClick={() => onUnderenhetClick(virksomhet)}
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
                                                <span>{virksomhet.OrganizationNumber}</span>
                                            </BodyShort>
                                        </div>
                                        {valgtOrganisasjon.OrganizationNumber ===
                                            virksomhet.OrganizationNumber && (
                                            <Success
                                                aria-hidden={true}
                                                className="virksomhetsknapp__valgt-ikon"
                                            />
                                        )}
                                    </div>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </li>
    );
};

export default JuridiskEnhet;
