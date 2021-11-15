import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';

import { Organisasjon, tomAltinnOrganisasjon, } from '../organisasjon';
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
    const {
        valgtOrganisasjon,
        aktivtOrganisasjonstre,
        velgUnderenhet,
        søketekst: soketekst,
        setSøketekst: setSoketekst,
    } = useContext(VirksomhetsvelgerContext)
    const [erApen, setErApen] = useState(false);

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


    let forsteJuridiskEnhetILista = tomAltinnOrganisasjon;
    if (aktivtOrganisasjonstre.length > 0) {
        forsteJuridiskEnhetILista =
            soketekst.length === 0
                ? aktivtOrganisasjonstre.find(
                    (juridiskenhet) =>
                        juridiskenhet.JuridiskEnhet.OrganizationNumber ===
                        valgtOrganisasjon.ParentOrganizationNumber
                )!!.JuridiskEnhet!!
                : aktivtOrganisasjonstre[0].JuridiskEnhet;
    }

    const onEnterSearchbox = () => {
        if (soketekst.length > 0 && aktivtOrganisasjonstre.length > 0) {
            const kunTreffPåEnUnderenhet =
                aktivtOrganisasjonstre.length === 1 && aktivtOrganisasjonstre[0].Underenheter.length === 1;
            if (kunTreffPåEnUnderenhet) {
                const underenhet = aktivtOrganisasjonstre[0].Underenheter[0];
                if (underenhet.OrganizationNumber !== valgtOrganisasjon.OrganizationNumber) {
                    velgUnderenhet(
                        aktivtOrganisasjonstre[0].Underenheter[0].OrganizationNumber,
                    );
                } else {
                    setErApen(false);
                }
            } else {
                setOrganisasjonIFokus(aktivtOrganisasjonstre[0].JuridiskEnhet);
            }
        }
    };

    const setFocusOnForsteVirksomhet = () => {
        if (aktivtOrganisasjonstre.length > 0 || soketekst.length === 0) {
            const blarOppTilSøkefeltOgNedTilMeny =
                forrigeOrganisasjonIFokus.OrganizationNumber ===
                aktivtOrganisasjonstre[0].JuridiskEnhet.OrganizationNumber;
            const valgtJuridiskEnhetErFørsteILista =
                forsteJuridiskEnhetILista.OrganizationNumber ===
                aktivtOrganisasjonstre[0].JuridiskEnhet.OrganizationNumber;
            const skalBlaTilFørsteElementIMenyKomponenter =
                (blarOppTilSøkefeltOgNedTilMeny && !valgtJuridiskEnhetErFørsteILista) ||
                soketekst.length > 0;

            if (skalBlaTilFørsteElementIMenyKomponenter) {
                setOrganisasjonIFokus(aktivtOrganisasjonstre[0].JuridiskEnhet);
            } else {
                setOrganisasjonIFokus(forsteJuridiskEnhetILista);
            }
        }
    };

    const antallTreff = aktivtOrganisasjonstre
        .map(({Underenheter}) => Underenheter.length)
        .reduce((x, y) => x + y, 0)

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
                            antallTreff={antallTreff}
                        />

                        <div className="dropdownmeny-elementer-wrapper">
                            <div
                                className={`dropdownmeny-elementer ${
                                    !!soketekst ? 'medSokeTekst' : ''
                                }`}>
                                {aktivtOrganisasjonstre.length > 0 && (
                                    <Menyvalg
                                        organisasjonIFokus={organisasjonIFokus}
                                        setOrganisasjonIFokus={setOrganisasjonIFokus}
                                        forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                        setForrigeOrganisasjonIFokus={
                                            setForrigeOrganisasjonIFokus
                                        }
                                        menyKomponenter={aktivtOrganisasjonstre}
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
