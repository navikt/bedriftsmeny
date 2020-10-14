import React, { FunctionComponent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { Organisasjon } from '../../../../organisasjon';
import { settOrgnummerIUrl } from '../../../utils/utils';
import './Underenhet.less';

interface Props {
    underEnhet: Organisasjon;
    valgtOrganisasjon: Organisasjon;
    history: History;
    setErApen: (bool: boolean) => void;
    hover: boolean;
    setHover: (bool: boolean) => void;
    erApen: boolean;
    setNyOrganisasjonIFokus: (KeypressKey: string, erApen: boolean) => void;
}

const Underenhet: FunctionComponent<Props> = ({
    underEnhet,
    valgtOrganisasjon,
    history,
    setErApen,
    hover,
    setHover,
    erApen,
    setNyOrganisasjonIFokus
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


    return (
        <li
            onClick={() => onUnderenhetSelect(underEnhet.OrganizationNumber)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onUnderenhetSelect(underEnhet.OrganizationNumber);
                }
                else {
                    setNyOrganisasjonIFokus(e.key,false)
                }
            }}
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
