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
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import Sokefelt from './Sokefelt/Sokefelt';
import { hentUrlMedOrgnummer } from './MenyValg/JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhetsvelger';
import './Virksomhetsvelger.less';

export interface VirksomhetsvelgerProps {
    organisasjoner: Organisasjon[];
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

const finnOrganisasjonVedOrgnummer = (organisasjoner: Organisasjon[]) => {
    const orgnummerFraUrl = new URL(window.location.href).searchParams.get('bedrift');
    return organisasjoner.find(
        (organisasjon) => organisasjon.OrganizationNumber === orgnummerFraUrl
    );
};

const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = (props) => {
    const { organisasjoner, organisasjonstre, history } = props;

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon | undefined>();
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    const brukOrgnummerFraFørsteOrganisasjon = () => {
        const { search } = hentUrlMedOrgnummer(organisasjoner[0].OrganizationNumber);
        history.replace({ search });
    };

    const brukOrganisasjonMedOrgnummer = () => {
        const organisasjonFraUrl = finnOrganisasjonVedOrgnummer(organisasjoner);

        if (!organisasjonFraUrl) {
            brukOrgnummerFraFørsteOrganisasjon();
        }

        setValgtOrganisasjon(organisasjonFraUrl || organisasjoner[0]);
    };

    useEffect(() => {
        setErApen(false);

        const organisasjonerErLastetInn = organisasjoner.length > 0;
        if (organisasjonerErLastetInn) {
            brukOrganisasjonMedOrgnummer();
        }
    }, [history.location, organisasjoner]);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(
            byggSokeresultat(organisasjonstre, organisasjoner, soketekst)
        );
    };

    const setOrganisasjonHvisUnderEnhet = (value: any) => {
        const { pathname, search } = hentUrlMedOrgnummer(value);

        history.replace({
            pathname,
            search
        });
    };

    return (
        <div className="virksomhetsvelger">
            <Wrapper
                className="virksomhetsvelger__wrapper"
                closeOnSelection={false}
                onSelection={(value) => setOrganisasjonHvisUnderEnhet(value)}
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
