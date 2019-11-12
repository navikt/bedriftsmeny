import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Wrapper } from 'react-aria-menubutton';
import { History } from 'history';

import { byggSokeresultat } from './byggSokeresultat';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon, tomAltinnOrganisasjon } from '../Organisasjon';
import { settOrgnummerIUrl } from './utils';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import useOrganisasjon from './useOrganisasjon';
import './Virksomhetsvelger.less';
import { VirksomhetsvelgerDropdown } from './VirksomhetsvelgerDropdown/VirksomhetsvelgerDropdown';

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
                                <Organisasjonsbeskrivelse
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                />
                            )}
                        </Button>
                    )}

                    {valgtOrganisasjon !== undefined && (
                        <VirksomhetsvelgerDropdown
                            soketekst={soketekst}
                            erApen={erApen}
                            valgtOrganisasjon={valgtOrganisasjon}
                            onSoketekstChange={brukSoketekst}
                            organisasjonstre={organisasjonstre}
                            history={history}
                            sokeresultat={listeMedOrganisasjonerFraSok}
                        />
                    )}
                </>
            </Wrapper>
        </div>
    );
};

export default Virksomhetsvelger;
