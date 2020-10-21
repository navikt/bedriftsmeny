import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../organisasjon';
import { byggSokeresultat } from './utils/byggSokeresultat';
import Menyvalg from './Menyvalg/Menyvalg';
import Sokefelt from './Menyvalg/Sokefelt/Sokefelt';
import useOrganisasjon from './utils/useOrganisasjon';
import MenyKnapp from './Menyknapp/Menyknapp';
import './Virksomhetsvelger.less';
import { setfokusPaMenyKnapp, setfokusPaSokefelt } from './Menyvalg/pilnavigerinsfunksjoner';
import { Normaltekst } from 'nav-frontend-typografi';

export interface VirksomhetsvelgerProps {
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
    history: History;
}

const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = (props) => {
    const bedriftvelgernode = useRef<HTMLDivElement>(null);
    const { organisasjonstre, onOrganisasjonChange, history } = props;
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );
    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);
    const [forrigeOrganisasjonIFokus, setForrigeOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);

    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, history);

    useEffect(() => {
        setErApen(false);
        if (valgtOrganisasjon) {
            onOrganisasjonChange(valgtOrganisasjon);
        }
    }, [valgtOrganisasjon]);

    const handleOutsideClick: { (event: MouseEvent): void } = (e: MouseEvent) => {
        const node = bedriftvelgernode.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    const handleOutsidePress: { (event: KeyboardEvent): void } = (e: KeyboardEvent) => {
        const bediftsmenyInnhold = bedriftvelgernode.current;
        if (bediftsmenyInnhold?.contains(document.activeElement)){
            return
        }
        setErApen(false)
    };

    useEffect(() => {
        if (!erApen) {
            setfokusPaMenyKnapp();
            setOrganisasjonIFokus(tomAltinnOrganisasjon);
        }
        else {
            setfokusPaSokefelt();
        }
    }, [erApen]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);
        return () => {
            window.removeEventListener('click', handleOutsideClick, false);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleOutsidePress, false);
    }, []);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
    };

    const menyKomponenter= soketekst.length === 0 ?
        organisasjonstre
        : listeMedOrganisasjonerFraSok

    let forsteJuridiskEnhetILista = tomAltinnOrganisasjon
    if (valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon && menyKomponenter) {
        if (menyKomponenter.length>0) {
            forsteJuridiskEnhetILista = soketekst.length === 0 ?
                menyKomponenter.
                find(juridiskenhet => juridiskenhet.JuridiskEnhet.OrganizationNumber === valgtOrganisasjon.ParentOrganizationNumber)!!.JuridiskEnhet!!
                : menyKomponenter[0].JuridiskEnhet
        }
    }
    return (
        <nav className="virksomhetsvelger" aria-label="Velg virksomhet"
             onKeyDown={ (event) => {
                 if (event.key === 'Escape') {
                     setErApen(false);
                 }
             }
        }>
            <div ref={bedriftvelgernode} className="virksomhetsvelger__wrapper">
                {valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <MenyKnapp
                        navn={valgtOrganisasjon.Name}
                        orgnummer={valgtOrganisasjon.OrganizationNumber}
                        erApen={erApen}
                        setErApen={setErApen}
                        setSoketekst={setSoketekst}
                    />
                )}
                <>
                    {valgtOrganisasjon !== undefined && (
                        <div
                            role={"toolbar"}
                            className={`virksomhetsvelger__dropdown--${
                                erApen ? 'apen' : 'lukket'
                            }`}
                            id="virksomhetsvelger__dropdown">
                            <Sokefelt
                                setOrganisasjonIFokus={setOrganisasjonIFokus}
                                forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                juridiskEnhetTilValgtOrganisasjon ={forsteJuridiskEnhetILista}
                                menyKomponenter = {menyKomponenter}
                                soketekst={soketekst}
                                treffPåOrganisasjoner={listeMedOrganisasjonerFraSok}
                                onChange={brukSoketekst} />
                            <div className="dropdownmeny-elementer-wrapper">
                                <div className="dropdownmeny-elementer">
                                    { menyKomponenter && menyKomponenter?.length> 0 ?
                                        <Menyvalg
                                        organisasjonIFokus={organisasjonIFokus}
                                        setOrganisasjonIFokus={setOrganisasjonIFokus}
                                        forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                        setForrigeOrganisasjonIFokus={setForrigeOrganisasjonIFokus}
                                        menyKomponenter={menyKomponenter}
                                        erApen={erApen}
                                        setErApen={setErApen}
                                        history={history}
                                        valgtOrganisasjon={valgtOrganisasjon}
                                        erSok={soketekst !== ''}
                                    />
                                    :
                                        <Normaltekst className={'virksomhetsvelger__ingen-treff'}> Ingen treff </Normaltekst>
                                    }

                                </div>
                            </div>
                        </div>
                    )}
                </>
            </div>
        </nav>
    );
};

export default Virksomhetsvelger;