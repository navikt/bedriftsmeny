import React, { FunctionComponent, useEffect, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import { erPilNavigasjon, setfokusPaMenyKnapp } from '../pilnavigerinsfunksjoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { settOrgnummerIUrl } from '../../utils/utils';
import { History } from 'history';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    juridiskEnhetTilValgtOrganisasjon: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[] | undefined;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
    setErApen: (apen: boolean) => void;
    valgtOrganisasjon: Organisasjon;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange, treffPåOrganisasjoner, forrigeOrganisasjonIFokus,juridiskEnhetTilValgtOrganisasjon, menyKomponenter, setOrganisasjonIFokus, history, setErApen, valgtOrganisasjon  }) => {
    const [arialabelTekst, setArialabelTekst] = useState("Søk etter virksomhet")

    useEffect(() => {
        const underenheter: Organisasjon[] = [];
        treffPåOrganisasjoner?.forEach((juridiskEnhet) => underenheter.push.apply(underenheter, juridiskEnhet.Underenheter))
        if (soketekst.length === 0) {
            setArialabelTekst(`Søk etter virksomhet`)
        }
        else if (treffPåOrganisasjoner?.length === 0) {
            setArialabelTekst(`Ingen treff for \"${soketekst}\"`)
        }
        else if (treffPåOrganisasjoner) {
            setArialabelTekst(`${underenheter.length} treff for \"${soketekst}\"` )
        }
    }, [soketekst, treffPåOrganisasjoner]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onEnter()
        }
        if (key === 'ArrowUp' || key === 'Up') {
            setfokusPaMenyKnapp()
        }
        if (key === 'ArrowDown' || key === 'Down') {
            settFokusPaForsteEnhet()
        }
    }

    const onEnter = () => {
        if (soketekst.length>0 && menyKomponenter) {
            const kunTreffPåEnUnderenhet = menyKomponenter.length === 1 && menyKomponenter[0].Underenheter.length === 1;
            if (kunTreffPåEnUnderenhet) {
                const underenhet = menyKomponenter[0].Underenheter[0];
                if (underenhet.OrganizationNumber !== valgtOrganisasjon.OrganizationNumber) {
                    settOrgnummerIUrl(menyKomponenter[0].Underenheter[0].OrganizationNumber, history);
                }
                else {
                    setErApen(false);
                }
            }
            else {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
            }
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
            aria-label={"Søk"}
            aria-haspopup={false}
            value={soketekst}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Søk"
            onKeyDown={ (e) => {
                if (erPilNavigasjon(e.key) || e.key === 'Enter') {
                    onKeyDown(e.key)
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
        />
        <Normaltekst className={"bedriftsmeny-sokefelt__skjult-aria-live-sokeresultat"} aria-live="assertive">{arialabelTekst}</Normaltekst>
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