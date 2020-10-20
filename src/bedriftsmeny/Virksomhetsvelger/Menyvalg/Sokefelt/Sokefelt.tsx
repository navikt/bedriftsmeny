import React, { FunctionComponent, useEffect, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import { erPilNavigasjon, setfokusPaMenyKnapp } from '../pilnavigerinsfunksjoner';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    juridiskEnhetTilValgtOrganisasjon: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[] | undefined;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange, treffPåOrganisasjoner, forrigeOrganisasjonIFokus,juridiskEnhetTilValgtOrganisasjon, menyKomponenter, setOrganisasjonIFokus }) => {
    const [arialabelTekst, setArialabelTekst] = useState("Søk etter virksomhet")

    useEffect(() => {
        const underenheter: Organisasjon[] = [] ;
        treffPåOrganisasjoner?.forEach((juridiskEnhet) => underenheter.push.apply(underenheter, juridiskEnhet.Underenheter))

        if (soketekst.length === 0) {
            setArialabelTekst("Søk etter underenheter")
        }
        else if (treffPåOrganisasjoner?.length === 0) {
            setArialabelTekst("Ingen treff for dette søkeordet")
        }
        else if (treffPåOrganisasjoner) {
            setArialabelTekst(underenheter.length + " treff på underenheter")
        }
    }, [soketekst, treffPåOrganisasjoner]);

    const onChangeForAriaDelay = (verdi: string) => {

    setTimeout(function(){
        onChange(verdi)
        }, 1);
    }

    const onKeyDown = (key: string) => {
        if (key === 'ArrowUp') {
            setfokusPaMenyKnapp()
        }
        if (key === 'ArrowDown') {
            settFokusPaForsteEnhet()
        }
    }

    const settFokusPaForsteEnhet = () => {
        if (menyKomponenter) {
            const blarOppTilSøkefeltOgNedTilMeny =
                forrigeOrganisasjonIFokus.OrganizationNumber === menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const valgtJuridiskEnhetErFørsteILista = juridiskEnhetTilValgtOrganisasjon.OrganizationNumber === menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const skalBlaTilFørsteElementIMenyKomponenter = (blarOppTilSøkefeltOgNedTilMeny && !valgtJuridiskEnhetErFørsteILista) || soketekst.length>0 ;
            if (skalBlaTilFørsteElementIMenyKomponenter) {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet)
            }
            else {
                setOrganisasjonIFokus(juridiskEnhetTilValgtOrganisasjon)
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
            aria-live = {"polite"}
            aria-label={arialabelTekst}
            value={soketekst}
            onChange={(e) => onChangeForAriaDelay(e.target.value)}
            placeholder="Søk"
            onKeyDown={ (e) => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault()
                    e.stopPropagation()
                }
                onKeyDown(e.key)
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