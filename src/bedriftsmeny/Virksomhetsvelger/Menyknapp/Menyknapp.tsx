import React, { useContext } from 'react';
import { erPilNavigasjon, setfokusPaSokefelt } from '../Menyvalg/pilnavigerinsfunksjoner';
import { VirksomhetsvelgerContext } from '../VirksomhetsvelgerProvider';
import { MenyknappView } from './MenyknappView';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

const MenyKnapp = ({ erApen, setErApen }: Props) => {
    const {
        valgtOrganisasjon: { Name, OrganizationNumber },
        setSøketekst,
    } = useContext(VirksomhetsvelgerContext);
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
        <MenyknappView
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
    );
};

export default MenyKnapp;
