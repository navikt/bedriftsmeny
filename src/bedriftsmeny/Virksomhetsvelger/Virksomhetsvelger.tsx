import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { History } from 'history';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon, tomAltinnOrganisasjon, } from '../organisasjon';
import { byggSokeresultat } from './utils/byggSokeresultat';
import Menyvalg from './Menyvalg/Menyvalg';
import Sokefelt from './Menyvalg/Sokefelt/Sokefelt';
import useOrganisasjon from './utils/useOrganisasjon';
import MenyKnapp from './Menyknapp/Menyknapp';
import { setfokusPaMenyKnapp, setfokusPaSokefelt } from './Menyvalg/pilnavigerinsfunksjoner';
import './Virksomhetsvelger.less';
import { useHandleOutsideEvent } from './useHandleOutsideEvent';
import { settOrgnummerIUrl } from './utils/utils';

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

    useHandleOutsideEvent(bedriftvelgernode, () => {
        setErApen(false);
    });

    if (valgtOrganisasjon === undefined) {
        return null;
    }

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

    const onEnterSearchbox = () => {
        if (
            soketekst.length > 0 &&
            listeMedOrganisasjonerFraSok &&
            listeMedOrganisasjonerFraSok?.length > 0 &&
            menyKomponenter
        ) {
            const kunTreffPåEnUnderenhet =
                menyKomponenter.length === 1 && menyKomponenter[0].Underenheter.length === 1;
            if (kunTreffPåEnUnderenhet) {
                const underenhet = menyKomponenter[0].Underenheter[0];
                if (underenhet.OrganizationNumber !== valgtOrganisasjon.OrganizationNumber) {
                    settOrgnummerIUrl(
                        menyKomponenter[0].Underenheter[0].OrganizationNumber,
                        history
                    );
                } else {
                    setErApen(false);
                }
            } else {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
            }
        }
    };

    const setFocusOnForsteVirksomhet = () => {
        if (
            menyKomponenter &&
            ((listeMedOrganisasjonerFraSok && listeMedOrganisasjonerFraSok?.length > 0) || soketekst.length === 0)
        ) {
            const blarOppTilSøkefeltOgNedTilMeny =
                forrigeOrganisasjonIFokus.OrganizationNumber ===
                menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const valgtJuridiskEnhetErFørsteILista =
                forsteJuridiskEnhetILista.OrganizationNumber ===
                menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const skalBlaTilFørsteElementIMenyKomponenter =
                (blarOppTilSøkefeltOgNedTilMeny && !valgtJuridiskEnhetErFørsteILista) ||
                soketekst.length > 0;

            if (skalBlaTilFørsteElementIMenyKomponenter) {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
            } else {
                setOrganisasjonIFokus(forsteJuridiskEnhetILista);
            }
        }
    };


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
                                onArrowUp={() => setfokusPaMenyKnapp()}
                                onArrowDown={() => setFocusOnForsteVirksomhet()}
                                onEnter={() => onEnterSearchbox()}
                                soketekst={soketekst}
                                treffPåOrganisasjoner={listeMedOrganisasjonerFraSok}
                                onChange={brukSoketekst}
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
