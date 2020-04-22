import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon
} from '../Organisasjon';
import { byggSokeresultat } from './byggSokeresultat';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';
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

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(byggSokeresultat(organisasjonstre, soketekst));
    };

    return (
        <div className="virksomhetsvelger">
            <div className="virksomhetsvelger__wrapper">
                {valgtOrganisasjon && valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <button
                        onClick={() => {
                            setErApen(!erApen);
                        }}
                        className="virksomhetsvelger__button"
                        id="virksomhetsvelger__button"
                        aria-label="Virksomhetsvelger"
                        aria-pressed={erApen}
                        aria-haspopup="true"
                        aria-controls="virksomhetsvelger__dropdown"
                        aria-expanded={erApen}
                    >
                        <MenyKnapp
                            navn={valgtOrganisasjon.Name}
                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                            erApen={erApen}
                        />
                    </button>
                )}
                <div>
                {valgtOrganisasjon !== undefined && (
                    <div
                        className={`virksomhetsvelger__dropdownwrapper--${
                            erApen ? 'apen' : 'lukket'
                        }`}
                        id="virksomhetsvelger__dropdown"
                    >
                        <div className="virksomhetsvelger__meny">
                            <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
                            {soketekst.length === 0 ? (
                                <DefaultMeny menyKomponenter={organisasjonstre} history={history} />
                            ) : (
                                <MenyFraSokeresultat
                                    ListeMedObjektFraSok={listeMedOrganisasjonerFraSok}
                                />
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default Virksomhetsvelger;
