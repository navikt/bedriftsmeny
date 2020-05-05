import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Menu, Wrapper } from 'react-aria-menubutton';
import { History } from 'history';

import { byggSokeresultat } from './byggSokeresultat';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../Organisasjon';
import { settOrgnummerIUrl } from './utils';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/Underenhetsvelger/MenyFraSokeresultat/MenyFraSokeresultat';
import Sokefelt from './Sokefelt/Sokefelt';
import useOrganisasjon from './useOrganisasjon';
import './Virksomhetsvelger.less';
import MenyKnapp from "./Menyknapp/Menyknapp";

export interface VirksomhetsvelgerProps {
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
    history: History;
}

const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = (props) => {
    const { organisasjonstre, onOrganisasjonChange, history } = props;
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, history);

    useEffect(() => {
        setErApen(false);
        if (valgtOrganisasjon) {
            onOrganisasjonChange(valgtOrganisasjon);
        }
    }, [valgtOrganisasjon]);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
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
                                <MenyKnapp
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                    erApen={erApen}
                                />
                            )}
                        </Button>
                    )}

                    {valgtOrganisasjon !== undefined && (
                        <div
                            className={`virksomhetsvelger__dropdownwrapper--${
                                erApen ? 'apen' : 'lukket'
                            }`}>
                            <Menu className="virksomhetsvelger__meny">
                                <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
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
                                </Menu>
                        </div>
                    )}
                </>
            </Wrapper>
        </div>
    );
};

export default Virksomhetsvelger;
