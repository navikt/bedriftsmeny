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

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);

        return () => {
            window.removeEventListener('click', handleOutsideClick, false);
        };
    }, []);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
    };

    const menyKomponenter= soketekst.length === 0 ?
        organisasjonstre
        : listeMedOrganisasjonerFraSok

    let forsteJuridiskEnhet = ''
    if (valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon) {
        forsteJuridiskEnhet = soketekst.length === 0 ?
            valgtOrganisasjon?.OrganizationNumber
            : listeMedOrganisasjonerFraSok!![0].JuridiskEnhet.OrganizationNumber;

    }

    return (
        <nav className="virksomhetsvelger" aria-label="Velg virksomhet">
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
                            className={`virksomhetsvelger__dropdown--${
                                erApen ? 'apen' : 'lukket'
                            }`}
                            id="virksomhetsvelger__dropdown">
                            <Sokefelt
                                forsteJuridiskeEnhet ={forsteJuridiskEnhet}
                                soketekst={soketekst}
                                onChange={brukSoketekst} />
                            <div className="dropdownmeny-elementer-wrapper">
                                <div className="dropdownmeny-elementer">
                                    <Menyvalg
                                        menyKomponenter={menyKomponenter}
                                        erApen={erApen}
                                        setErApen={setErApen}
                                        history={history}
                                        valgtOrganisasjon={valgtOrganisasjon}
                                        erSok={soketekst !== ''}
                                    />
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
