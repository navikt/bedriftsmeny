import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';

import { Organisasjon, tomAltinnOrganisasjon, } from '../organisasjon';
import { byggSokeresultat } from './utils/byggSokeresultat';
import Menyvalg from './Menyvalg/Menyvalg';
import Sokefelt from './Menyvalg/Sokefelt/Sokefelt';
import MenyKnapp from './Menyknapp/Menyknapp';
import { setfokusPaMenyKnapp, setfokusPaSokefelt } from './Menyvalg/pilnavigerinsfunksjoner';
import './Virksomhetsvelger.less';
import { useHandleOutsideEvent } from './useHandleOutsideEvent';
import { VirksomhetsvelgerContext } from './VirksomhetsvelgerProvider';

export interface VirksomhetsvelgerProps {
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
}

const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = (props) => {
    const bedriftvelgernode = useRef<HTMLDivElement>(null);
    const { onOrganisasjonChange } = props;
    const {valgtOrganisasjon, organisasjonstre, velgUnderenhet} = useContext(VirksomhetsvelgerContext)
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(organisasjonstre);
    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);
    const [forrigeOrganisasjonIFokus, setForrigeOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);

    useEffect(() => {
        setErApen(false);
        onOrganisasjonChange(valgtOrganisasjon);
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

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
    };

    const menyKomponenter =
        soketekst.length === 0 ? organisasjonstre : listeMedOrganisasjonerFraSok;

    let forsteJuridiskEnhetILista = tomAltinnOrganisasjon;
    if (menyKomponenter && menyKomponenter.length > 0) {
        forsteJuridiskEnhetILista =
            soketekst.length === 0
                ? menyKomponenter.find(
                    (juridiskenhet) =>
                        juridiskenhet.JuridiskEnhet.OrganizationNumber ===
                        valgtOrganisasjon.ParentOrganizationNumber
                )!!.JuridiskEnhet!!
                : menyKomponenter[0].JuridiskEnhet;
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
                    velgUnderenhet(
                        menyKomponenter[0].Underenheter[0].OrganizationNumber,
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
                <MenyKnapp
                    erApen={erApen}
                    setErApen={setErApen}
                    setSoketekst={setSoketekst}
                />
                <>
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
                                        erSok={!!soketekst}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </nav>
    );
};

export default Virksomhetsvelger;
