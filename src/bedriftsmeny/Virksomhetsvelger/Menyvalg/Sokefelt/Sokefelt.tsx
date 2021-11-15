import React, { FunctionComponent, useEffect, useState } from 'react';

import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import Forstørrelsesglass from './Forstørrelsesglass';
import { erPilNavigasjon } from '../pilnavigerinsfunksjoner';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    onEnter: () => void;
    onArrowDown: () => void;
    onArrowUp: () => void;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
}

const Sokefelt: FunctionComponent<Props> = ({
    soketekst,
    onChange,
    onEnter,
    onArrowDown,
    onArrowUp,
    treffPåOrganisasjoner,
}) => {
    const [ariaTekst, setTekst] = useState('Søk etter virksomhet');

    useEffect(() => {
        const underenheter: Organisasjon[] = [];
        treffPåOrganisasjoner?.forEach((juridiskEnhet) =>
            underenheter.push.apply(underenheter, juridiskEnhet.Underenheter)
        );
        if (soketekst.length === 0) {
            setTekst('');
        } else if (treffPåOrganisasjoner?.length === 0) {
            setTekst(`Ingen treff for \"${soketekst}\"`);
        } else if (treffPåOrganisasjoner) {
            setTekst(`${underenheter.length} treff for \"${soketekst}\"`);
        }
    }, [soketekst, treffPåOrganisasjoner]);

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
