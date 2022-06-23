import React, {useContext} from 'react';

import {erPilNavigasjon, setfokusPaSokefelt} from '../Menyvalg/pilnavigerinsfunksjoner';
import './Menyknapp.less';
import {VirksomhetsvelgerContext} from '../VirksomhetsvelgerProvider';
import {Virksomhetsvelger2} from "../Virksomhetsvelger2";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

const MenyKnapp = ({erApen, setErApen}: Props) => {
    const {
        valgtOrganisasjon: {Name, OrganizationNumber},
        setSøketekst,
    } = useContext(VirksomhetsvelgerContext)
    const onKeyPress = (key: string, skift: boolean) => {
        if (key === 'ArrowDown' || key === 'Down') {
            if (erApen) {
                setfokusPaSokefelt();
                setSøketekst('');
            }
        }
        if (key === 'Tab' && skift) {
            setErApen(false);
        }
    };

    return (
        <Virksomhetsvelger2
            navn={Name}
            orgNummer={OrganizationNumber}
            isOpen={erApen}
            onClick={() => {
                setSøketekst('');
                setErApen(!erApen);
            }}
            onKeyDown={(e) => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                onKeyPress(e.key, e.shiftKey);
            }}
        />
    )
}

export default MenyKnapp;
