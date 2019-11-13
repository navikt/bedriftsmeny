import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Wrapper } from 'react-aria-menubutton';
import { History } from 'history';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../Organisasjon';
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

    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, history);

    useEffect(() => {
        setErApen(false);
        if (valgtOrganisasjon) {
            onOrganisasjonChange(valgtOrganisasjon);
        }
    }, [valgtOrganisasjon]);

    return (
        <div className="virksomhetsvelger">
            <Wrapper
                className="virksomhetsvelger__wrapper"
                closeOnSelection={false}
                onSelection={(value: string) => {
                    settOrgnummerIUrl(value, history);
                }}
                onMenuToggle={({ isOpen }) => {
                    console.log('togglin');
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
                            erApen={erApen}
                            valgtOrganisasjon={valgtOrganisasjon}
                            organisasjonstre={organisasjonstre}
                            history={history}
                        />
                    )}
                </>
            </Wrapper>
        </div>
    );
};

export default Virksomhetsvelger;
