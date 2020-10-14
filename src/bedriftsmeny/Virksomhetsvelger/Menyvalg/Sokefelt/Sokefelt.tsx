import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';
import { Organisasjon } from '../../../organisasjon';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    forsteJuridiskeEnhet: Organisasjon;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange, forsteJuridiskeEnhet }) => {

    const settFokusPaForsteEnhet = (keyCodeKey: string) => {
        if (keyCodeKey === 'ArrowDown') {
            let enhetElement = document.getElementById("organisasjons-id-"+forsteJuridiskeEnhet.OrganizationNumber)
            if (enhetElement) {
                enhetElement.focus()
            }
        else {
                enhetElement = document.getElementById('valgtjuridiskenhet')
                enhetElement && enhetElement.focus()
            }
        }
    }

    return (
    <div className="bedriftsmeny-sokefelt">
        <Input
            id = {"bedriftsmeny-sokefelt"}
            className="bedriftsmeny-sokefelt__felt"
            type="search"
            label=""
            aria-label="Søk etter virksomhet"
            value={soketekst}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Søk"
            onKeyDown={ (e) => {
                settFokusPaForsteEnhet(e.key)

            }}
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
}

export default Sokefelt;