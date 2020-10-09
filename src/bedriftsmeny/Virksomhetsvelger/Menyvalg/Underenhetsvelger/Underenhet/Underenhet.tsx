import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../organisasjon';
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
    index: number;
    focus: boolean;
    setFocus: (num: number) => void;
}

const Underenhet: FunctionComponent<Props> = ({
    underEnhet,
    valgtOrganisasjon,
    history,
    setErApen,
    hover,
    setHover,
    erApen,
    index,
    focus,
    setFocus
}) => {
    const [erValgtEnhet, setErValgtEnhet] = useState(false);

    const onUnderenhetSelect = (value: string) => {
        settOrgnummerIUrl(value, history);
        setErApen(false);
        setHover(false);
    };

    /* const handleSelect = useCallback(() => {
        console.log(`${Underenhet}`);
        setFocus(index);
    }, [underEnhet, index, setFocus]); */

    const ref = useRef(null);

    useEffect(() => {
        setErValgtEnhet(false);
        if (valgtOrganisasjon.OrganizationNumber === underEnhet.OrganizationNumber) {
            setErValgtEnhet(true);
        }
        if (focus) {
            // @ts-ignore
            ref.current && ref.current.focus();
        }
    }, [valgtOrganisasjon, underEnhet, focus]);

    return (
        <li
            tabIndex={focus ? 0 : -1}
            ref={ref}
            onClick={() => onUnderenhetSelect(underEnhet.OrganizationNumber)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onUnderenhetSelect(underEnhet.OrganizationNumber);
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
            id={erValgtEnhet ? 'valgtunderenhet' : ''}
            key={underEnhet.OrganizationNumber}
        >
            <Organisasjonsbeskrivelse
                navn={underEnhet.Name}
                orgnummer={underEnhet.OrganizationNumber}
            />
        </li>
    );
};

export default Underenhet;
