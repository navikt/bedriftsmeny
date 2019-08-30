import React, { FunctionComponent, useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { Undertittel } from 'nav-frontend-typografi';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';
import { History } from 'history';

import { byggSokeresultat } from './byggSokeresultat';
import {
    JuridiskEnhetMedUnderEnheterArray,
    tomAltinnOrganisasjon,
    Organisasjon
} from '../Organisasjon';
import { settOrgnummerIUrl } from './utils';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import Sokefelt from './Sokefelt/Sokefelt';
import './Virksomhetsvelger.less';

export interface VirksomhetsvelgerProps {
    organisasjoner: Organisasjon[];
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = (props) => {
    const { organisasjoner, organisasjonstre, history } = props;

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    useEffect(() => {
        hentNyttOrgnummer();

        const unlisten = history.listen(hentNyttOrgnummer);
        return unlisten;
    }, [organisasjoner, organisasjonstre]);

    const brukOrgnummerFraFørsteOrganisasjon = () => {
        settOrgnummerIUrl(organisasjoner[0].OrganizationNumber, history);
    };

    const brukOrganisasjonMedOrgnummer = (orgnummer: string) => {
        const organisasjonFraUrl = organisasjoner.find(
            (organisasjon) => organisasjon.OrganizationNumber === orgnummer
        );

        if (!organisasjonFraUrl) {
            brukOrgnummerFraFørsteOrganisasjon();
        }

        setValgtOrganisasjon(organisasjonFraUrl || organisasjoner[0]);
    };

    const brukNyttOrgnummer = (orgnummer: string) => {
        setErApen(false);

        if (organisasjoner.length > 0) {
            brukOrganisasjonMedOrgnummer(orgnummer);
        }
    };

    const hentNyttOrgnummer = () => {
        const orgnummer = hentOrgnummerFraUrl();
        if (orgnummer) {
            brukNyttOrgnummer(orgnummer);
        }
    };

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(
            byggSokeresultat(organisasjonstre, organisasjoner, soketekst)
        );
    };

    return (
        <div className="virksomhetsvelger">
            <Wrapper
                className="virksomhetsvelger__wrapper"
                closeOnSelection={false}
                onSelection={(value: string) => {
                    settOrgnummerIUrl(value, history);
                }}
                onMenuToggle={({ isOpen }) => {
                    setErApen(isOpen);
                }}>
                <>
                    {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                        <Button
                            className="virksomhetsvelger__button"
                            disabled={valgtOrganisasjon === undefined}>
                            {valgtOrganisasjon !== undefined && (
                                <Organisasjonsbeskrivelse
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                />
                            )}
                        </Button>
                    )}

                    {valgtOrganisasjon !== undefined && (
                        <div
                            className={`virksomhetsvelger__dropdownwrapper--${
                                erApen ? 'apen' : 'lukket'
                            }`}>
                            <Collapse isOpened={erApen}>
                                <Menu className="virksomhetsvelger__dropdown">
                                    <div className="virksomhetsvelger__valgtVirksomhet">
                                        <Organisasjonsbeskrivelse
                                            brukOverskrift
                                            navn={valgtOrganisasjon.Name}
                                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                                        />
                                    </div>
                                    <Undertittel className="virksomhetsvelger__overskrift">
                                        Dine aktører
                                    </Undertittel>
                                    <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
                                    <div className="virksomhetsvelger__meny">
                                        {soketekst.length === 0 ? (
                                            <DefaultMeny
                                                menyKomponenter={organisasjonstre}
                                                history={history}
                                            />
                                        ) : (
                                            <MenyFraSokeresultat
                                                ListeMedObjektFraSok={listeMedOrganisasjonerFraSok}
                                            />
                                        )}
                                    </div>
                                </Menu>
                            </Collapse>
                        </div>
                    )}
                </>
            </Wrapper>
        </div>
    );
};

export default Virksomhetsvelger;
