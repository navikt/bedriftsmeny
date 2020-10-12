import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange }) => {
    const sokefeltref = useRef<HTMLDivElement>(null);

    const handleKeydown: { (e: KeyboardEvent): void } = (e: KeyboardEvent) => {
        const forsteVirksomhet = document.querySelector('.juridiskenhet--first') as HTMLElement;
        const menyknapp = document.querySelector('#virksomhetsvelger__button') as HTMLElement;
        const node = sokefeltref.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            if (e.key === 'ArrowDown') {
                if (forsteVirksomhet) {
                    forsteVirksomhet.focus();
                }
            }
            if (e.key === 'ArrowUp') {
                if (forsteVirksomhet) {
                    menyknapp.focus();
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown, false);

        return () => {
            window.removeEventListener('keydown', handleKeydown, false);
        };
    }, []);

    return (
        <div className="bedriftsmeny-sokefelt" ref={sokefeltref}>
            <Input
                className="bedriftsmeny-sokefelt__felt"
                id="bedriftsmeny-sokefelt"
                type="search"
                label=""
                aria-label="Søk etter virksomhet"
                value={soketekst}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Søk"
                tabIndex={-1}
            />
            <div className="bedriftsmeny-sokefelt__ikon">
                {soketekst.length === 0 ? (
                    <Forstørrelsesglass/>
                ) : (
                    <Kryss className="bedriftsmeny-sokefelt__ikon--klikkbart" onClick={() => onChange('')}/>
                )}
            </div>
        </div>
    );
};

export default Sokefelt;
