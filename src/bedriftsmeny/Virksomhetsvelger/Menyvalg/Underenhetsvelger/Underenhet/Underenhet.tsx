import React, { FunctionComponent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { Organisasjon, tomAltinnOrganisasjon } from '../../../../organisasjon';
import { settOrgnummerIUrl } from '../../../utils/utils';
import './Underenhet.less';
import { erPilNavigasjon, setfokusPaMenyKnapp } from '../../pilnavigerinsfunksjoner';

interface Props {
    underEnhet: Organisasjon;
    valgtOrganisasjon: Organisasjon;
    organisasjonIFokus: Organisasjon;
    history: History;
    setErApen: (bool: boolean) => void;
    hover: boolean;
    setHover: (bool: boolean) => void;
    erApen: boolean;
    setNyOrganisasjonIFokus: (KeypressKey: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
    lukkMenyOnTabPaNedersteElement: (organisasjonsnummer: string, erJuridiskEnhetSomViserUnderenheter: boolean) => void;
    lukkUnderenhetsvelgerOgFokuserPåEnhet: (underenhet: Organisasjon) => void;
}

const Underenhet: FunctionComponent<Props> = ({
    underEnhet,
    valgtOrganisasjon,
    organisasjonIFokus,
    history,
    setErApen,
    hover,
    setHover,
    erApen,
    setNyOrganisasjonIFokus,
    lukkUnderenhetsvelgerOgFokuserPåEnhet,
    lukkMenyOnTabPaNedersteElement,

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

    useEffect(() => {
        if (organisasjonIFokus.OrganizationNumber === underEnhet.OrganizationNumber) {
            const idTilUnderEnhet = underEnhet.OrganizationNumber === valgtOrganisasjon.OrganizationNumber ?
                'valgtunderenhet' : 'organisasjons-id-'+underEnhet.OrganizationNumber;
            const element = document.getElementById(idTilUnderEnhet)
            element && element.focus();
        }
    }, [valgtOrganisasjon, underEnhet, organisasjonIFokus]);

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
        if (key === 'ArrowLeft') {
            lukkUnderenhetsvelgerOgFokuserPåEnhet(underEnhet)
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
