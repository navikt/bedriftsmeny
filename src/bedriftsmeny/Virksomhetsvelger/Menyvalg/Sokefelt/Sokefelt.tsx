import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange }) => (
    <div className="bedriftsmeny-sokefelt">
        <Input
            className="bedriftsmeny-sokefelt__felt"
            type="search"
            label=""
            aria-label="Søk etter virksomhet"
            value={soketekst}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Søk"
        />
        <div className="bedriftsmeny-sokefelt__ikon">
            {soketekst.length === 0 ? (
                <Forstørrelsesglass />
            ) : (
                <Kryss className="bedriftsmeny-sokefelt__ikon--klikkbart" onClick={() => onChange('')} />
            )}
        </div>
    </div>
);

export default Sokefelt;
