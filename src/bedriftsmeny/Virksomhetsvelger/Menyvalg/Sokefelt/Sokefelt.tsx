import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { Search } from '@navikt/ds-react';
import { BodyShort } from '@navikt/ds-react';

import { erPilNavigasjon } from '../pilnavigerinsfunksjoner';
import { VirksomhetsvelgerContext } from '../../VirksomhetsvelgerProvider';
import './Sokefelt.less';

interface Props {
    onEnter: () => void;
    onArrowDown: () => void;
    onArrowUp: () => void;
    antallTreff: number | null;
}

const Sokefelt: FunctionComponent<Props> = ({ onEnter, onArrowDown, onArrowUp, antallTreff }) => {
    const { søketekst, setSøketekst } = useContext(VirksomhetsvelgerContext);
    const [ariaTekst, setTekst] = useState('Søk etter virksomhet');

    useEffect(() => {
        if (søketekst.length === 0 || antallTreff === null) {
            setTekst('');
        } else {
            const treff = antallTreff === 0 ? 'Ingen' : antallTreff;
            setTekst(`${treff} treff for \"${søketekst}\"`);
        }
    }, [søketekst, antallTreff]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onEnter();
        }
        if (key === 'ArrowUp' || key === 'Up') {
            onArrowUp();
        }
        if (key === 'ArrowDown' || key === 'Down') {
            onArrowDown();
        }
    };

    return (
        <div className="bedriftsmeny-sokefelt">
            <Search
                autoComplete="off"
                id="bedriftsmeny-sokefelt"
                className="bedriftsmeny-sokefelt__felt"
                label=""
                aria-label={'Søk'}
                aria-haspopup={false}
                value={søketekst}
                onChange={setSøketekst}
                placeholder="Søk"
                role="searchbox"
                onKeyDown={(e) => {
                    if (erPilNavigasjon(e.key) || e.key === 'Enter') {
                        onKeyDown(e.key);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            />
            <BodyShort
                className={'bedriftsmeny-sokefelt__skjult-aria-live-sokeresultat'}
                aria-live="assertive">
                {ariaTekst}
            </BodyShort>
        </div>
    );
};

export default Sokefelt;
