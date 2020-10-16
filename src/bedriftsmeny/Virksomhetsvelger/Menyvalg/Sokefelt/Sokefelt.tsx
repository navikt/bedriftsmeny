import React, { FunctionComponent, useEffect, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import { setfokusPaMenyKnapp } from '../pilnavigerinsfunksjoner';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    juridiskEnhetTilValgtOrganisasjon: string;
    organisasjonIFokus: Organisasjon;
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[] | undefined;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange, treffPåOrganisasjoner, organisasjonIFokus,juridiskEnhetTilValgtOrganisasjon, menyKomponenter }) => {
    const [arialabelTekst, setArialabelTekst] = useState("Søk etter virksomhet")

    useEffect(() => {
        if (!treffPåOrganisasjoner?.length && soketekst.length>0) {
            setArialabelTekst("Ingen treff for dette søkeordet")
        }
        else if (treffPåOrganisasjoner && treffPåOrganisasjoner?.length > 0 ||soketekst.length === 0) {
            setArialabelTekst("")
        }
    }, [soketekst, treffPåOrganisasjoner]);

    const onChangeForAriaDelay = (verdi: string) => {
        setTimeout(function(){
            onChange(verdi)
        }, 1);
    }

    const settFokusPaForsteEnhet = (keyCodeKey: string) => {
        if (keyCodeKey === 'ArrowDown') {
            //i dette caset blar man opp til søkefeltet og tilbake i menyen, og havner da øverst i lista
            if (menyKomponenter && organisasjonIFokus.OrganizationNumber === menyKomponenter[0].JuridiskEnhet.OrganizationNumber) {
                let enhetElement = document.getElementById("organisasjons-id-"+organisasjonIFokus.OrganizationNumber)
                enhetElement && console.log("fant id")
                enhetElement && enhetElement.focus();
                return;
            }
            let enhetElement = document.getElementById("organisasjons-id-"+juridiskEnhetTilValgtOrganisasjon)
            if (enhetElement) {
                enhetElement.focus()
            }
        else {
                enhetElement = document.getElementById('valgtjuridiskenhet')
                enhetElement && enhetElement.focus()
            }
        }
        if (keyCodeKey === 'ArrowUp') {
            setfokusPaMenyKnapp();
        }
    }

    return (
    <div className="bedriftsmeny-sokefelt">
        <Input
            id = {"bedriftsmeny-sokefelt"}
            className="bedriftsmeny-sokefelt__felt"
            type="search"
            label=""
            aria-live = {"polite"}
            aria-label={arialabelTekst}
            value={soketekst}
            onChange={(e) => onChangeForAriaDelay(e.target.value)}
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