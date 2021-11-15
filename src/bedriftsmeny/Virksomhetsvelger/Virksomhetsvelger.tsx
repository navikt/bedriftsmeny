import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { History } from 'history';

import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../organisasjon';
import { byggSokeresultat } from './utils/byggSokeresultat';
import Menyvalg from './Menyvalg/Menyvalg';
import Sokefelt from './Menyvalg/Sokefelt/Sokefelt';
import useOrganisasjon from './utils/useOrganisasjon';
import MenyKnapp from './Menyknapp/Menyknapp';
import { setfokusPaMenyKnapp, setfokusPaSokefelt } from './Menyvalg/pilnavigerinsfunksjoner';
import './Virksomhetsvelger.less';

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
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(organisasjonstre);
    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);
    const [forrigeOrganisasjonIFokus, setForrigeOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);

    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, history);

    useEffect(() => {
        setErApen(false);
        if (valgtOrganisasjon) {
            onOrganisasjonChange(valgtOrganisasjon);
        }
    }, [valgtOrganisasjon]);


    useEffect(() => {
        if (!erApen) {
            setfokusPaMenyKnapp();
            setOrganisasjonIFokus(tomAltinnOrganisasjon);
        } else {
            setfokusPaSokefelt();
        }
    }, [erApen]);

    const handleOutsideClick: { (event: MouseEvent | KeyboardEvent): void } = (
        e: MouseEvent | KeyboardEvent
    ) => {
        const node = bedriftvelgernode.current;
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);
        document.addEventListener('keydown', handleOutsideClick, false);
        return () => {
            document.removeEventListener('click', handleOutsideClick, false);
            document.removeEventListener('keydown', handleOutsideClick, false);
        };
    }, []);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
    };

    const menyKomponenter =
        soketekst.length === 0 ? organisasjonstre : listeMedOrganisasjonerFraSok;

    let forsteJuridiskEnhetILista = tomAltinnOrganisasjon;
    if (valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon && menyKomponenter) {
        if (menyKomponenter.length > 0) {
            forsteJuridiskEnhetILista =
                soketekst.length === 0
                    ? menyKomponenter.find(
                          (juridiskenhet) =>
                              juridiskenhet.JuridiskEnhet.OrganizationNumber ===
                              valgtOrganisasjon.ParentOrganizationNumber
                      )!!.JuridiskEnhet!!
                    : menyKomponenter[0].JuridiskEnhet;
        }
    }
    return (
        <nav
            className="virksomhetsvelger"
            aria-label="Velg virksomhet"
            onKeyDown={(event) => {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    setErApen(false);
                }
            }}>
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
                            role="toolbar"
                            className={`virksomhetsvelger__dropdown--${erApen ? 'apen' : 'lukket'}`}
                            aria-hidden={!erApen}
                            id="virksomhetsvelger__dropdown">
                            <Sokefelt
                                setOrganisasjonIFokus={setOrganisasjonIFokus}
                                forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                juridiskEnhetTilValgtOrganisasjon={forsteJuridiskEnhetILista}
                                menyKomponenter={menyKomponenter}
                                soketekst={soketekst}
                                treffPåOrganisasjoner={listeMedOrganisasjonerFraSok}
                                onChange={brukSoketekst}
                                setErApen={setErApen}
                                valgtOrganisasjon={valgtOrganisasjon}
                                history={history}
                            />

                            <div className="dropdownmeny-elementer-wrapper">
                                <div
                                    className={`dropdownmeny-elementer ${
                                        !!soketekst ? 'medSokeTekst' : ''
                                    }`}>
                                    {menyKomponenter && menyKomponenter?.length > 0 && (
                                        <Menyvalg
                                            organisasjonIFokus={organisasjonIFokus}
                                            setOrganisasjonIFokus={setOrganisasjonIFokus}
                                            forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                            setForrigeOrganisasjonIFokus={
                                                setForrigeOrganisasjonIFokus
                                            }
                                            menyKomponenter={menyKomponenter}
                                            erApen={erApen}
                                            setErApen={setErApen}
                                            history={history}
                                            valgtOrganisasjon={valgtOrganisasjon}
                                            erSok={!!soketekst}
                                        />
                                    )}
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
