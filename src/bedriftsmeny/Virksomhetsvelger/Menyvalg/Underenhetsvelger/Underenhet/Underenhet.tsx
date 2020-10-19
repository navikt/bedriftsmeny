import React, { FunctionComponent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { Organisasjon } from '../../../../organisasjon';
import { settOrgnummerIUrl } from '../../../utils/utils';
import './Underenhet.less';
import { erPilNavigasjon, setfokusPaMenyKnapp } from '../../pilnavigerinsfunksjoner';

interface Props {
    underEnhet: Organisasjon;
    valgtOrganisasjon: Organisasjon;
    history: History;
    setErApen: (bool: boolean) => void;
    hover: boolean;
    setHover: (bool: boolean) => void;
    erApen: boolean;
    setNyOrganisasjonIFokus: (KeypressKey: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
    lukkMenyOnTabPaNedersteElement: (organisasjonsnummer: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
}

const Underenhet: FunctionComponent<Props> = ({
    underEnhet,
    valgtOrganisasjon,
    history,
    setErApen,
    hover,
    setHover,
    erApen,
    setNyOrganisasjonIFokus,
    lukkMenyOnTabPaNedersteElement

}) => {
    const [erValgtEnhet, setErValgtEnhet] = useState(false);

    const onUnderenhetSelect = (value: string) => {
        settOrgnummerIUrl(value, history);
        setErApen(false);
        setHover(false);
    };

    useEffect(() => {
        setErValgtEnhet(false);
        if (valgtOrganisasjon.OrganizationNumber === underEnhet.OrganizationNumber) {
            setErValgtEnhet(true);
        }
    }, [valgtOrganisasjon, underEnhet]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onUnderenhetSelect(underEnhet.OrganizationNumber)
            return;
        }
        if (key === 'Tab') {
            lukkMenyOnTabPaNedersteElement(underEnhet.OrganizationNumber, false)
        }
        if (key === 'ArrowUp' || key === 'ArrowDown') {
            setNyOrganisasjonIFokus(key, false)
        }
    }

    return (
        <li
            onClick={() => {
                onUnderenhetSelect(underEnhet.OrganizationNumber);
            }
            }
            onKeyDown={(e) => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault()
                    e.stopPropagation()
                }
                onKeyDown(e.key)
            }
              }
            onMouseOver={() => {
                if (!erValgtEnhet) {
                    setHover(true);
                }
            }}
            onMouseLeave={() => {
                if (!erValgtEnhet) {
                    setHover(false);
                }
            }}
            role="menuitem"
            className={`underenhet ${
                hover && erValgtEnhet
                    ? 'valgtunderenhet-grey-on-hover'
                    : erValgtEnhet && !hover
                    ? 'valgtunderenhet'
                    : ''
            }`}
            id={erValgtEnhet ? 'valgtunderenhet' : 'organisasjons-id-'+underEnhet.OrganizationNumber}
            key={underEnhet.OrganizationNumber}
            tabIndex={erApen ? 0 : -1}>
            <Organisasjonsbeskrivelse
                navn={underEnhet.Name}
                orgnummer={underEnhet.OrganizationNumber}
            />
        </li>
    );
};

export default Underenhet;
