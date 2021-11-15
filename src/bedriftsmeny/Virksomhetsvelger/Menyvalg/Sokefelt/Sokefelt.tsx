import React, { FunctionComponent, useEffect, useState } from 'react';

import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Forstørrelsesglass from './Forstørrelsesglass';
import { erPilNavigasjon } from '../pilnavigerinsfunksjoner';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    onEnter: () => void;
    onArrowDown: () => void;
    onArrowUp: () => void;
    antallTreff: number | null;
}

const Sokefelt: FunctionComponent<Props> = ({
    soketekst,
    onChange,
    onEnter,
    onArrowDown,
    onArrowUp,
    antallTreff,
}) => {
    const [ariaTekst, setTekst] = useState('Søk etter virksomhet');

    useEffect(() => {
        if (soketekst.length === 0 || antallTreff === null) {
            setTekst('');
        } else {
            const treff = antallTreff === 0 ? 'Ingen' : antallTreff;
            setTekst(`${treff} treff for \"${soketekst}\"`);
        }
    }, [soketekst, antallTreff]);

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
            <Input
                autoComplete="off"
                id="bedriftsmeny-sokefelt"
                className="bedriftsmeny-sokefelt__felt"
                type="search"
                label=""
                aria-label={'Søk'}
                aria-haspopup={false}
                value={soketekst}
                onChange={(e) => onChange(e.target.value)}
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
            <Normaltekst
                className={'bedriftsmeny-sokefelt__skjult-aria-live-sokeresultat'}
                aria-live="assertive">
                {ariaTekst}
            </Normaltekst>
            <div className="bedriftsmeny-sokefelt__ikon">
                {soketekst.length === 0 ? <Forstørrelsesglass /> : null}
            </div>
        </div>
    );
};

export default Sokefelt;
