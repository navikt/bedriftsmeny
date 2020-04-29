import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { History } from 'history';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../Organisasjon';
import { byggSokeresultat } from './byggSokeresultat';
import DefaultMeny from './MenyValg/DefaultMeny';
import Sokefelt from './Sokefelt/Sokefelt';
import useOrganisasjon from './useOrganisasjon';
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

    return (
        <div className="virksomhetsvelger">
            <div ref={bedriftvelgernode} className="virksomhetsvelger__wrapper">
                {valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <button
                        onClick={() => {
                            setErApen(!erApen);
                            const valgtUnderenhet = document.getElementById('valgtunderenhet');
                            if (valgtUnderenhet && erApen && soketekst.length === 0) {
                                valgtUnderenhet.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                            if (!erApen) {
                                setSoketekst('');
                            }
                        }}
                        className="virksomhetsvelger__button"
                        id="virksomhetsvelger__button"
                        aria-label="Virksomhetsvelger"
                        aria-pressed={erApen}
                        aria-haspopup="true"
                        aria-controls="virksomhetsvelger__dropdown"
                        aria-expanded={erApen}>
                        <MenyKnapp
                            navn={valgtOrganisasjon.Name}
                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                            erApen={erApen}
                        />
                    </button>
                )}
                <>
                    {valgtOrganisasjon !== undefined && (
                        <div
                            className={`virksomhetsvelger__dropdownwrapper--${
                                erApen ? 'apen' : 'lukket'
                            }`}
                            id="virksomhetsvelger__dropdown">
                            <div className="virksomhetsvelger__meny">
                                <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
                                <DefaultMeny
                                    menyKomponenter={
                                        soketekst.length === 0
                                            ? organisasjonstre
                                            : listeMedOrganisasjonerFraSok
                                    }
                                    erApen={erApen}
                                    setErApen={setErApen}
                                    history={history}
                                    valgtOrganisasjon={valgtOrganisasjon}
                                    erSok={soketekst !== ''}
                                />
                            </div>
                        </div>
                    )}
                </>
            </div>
        </div>
    );
};

export default Virksomhetsvelger;
