import React, { useState } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../organisasjon';
import { History } from 'history';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[]|[];
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    history: History;
    valgtOrganisasjon: Organisasjon;
    erSok: boolean;
    ref: () => HTMLDivElement|null;
}

const Menyvalg = (props: Props) => {
    const { menyKomponenter = [], history, valgtOrganisasjon, setErApen, erSok, erApen, ref } = props;
    const [juridiskEnhetTrykketPaa, setJuridiskEnhetTrykketPaa] = useState<string>('');
    const [hover, setHover] = useState(false);

    return (
        <>
            {menyKomponenter.length ? menyKomponenter.map((organisasjon: any, index: number) => (
                <Underenhetsvelger
                    key={organisasjon.JuridiskEnhet.OrganizationNumber}
                    index={index}
                    menyKomponenter={menyKomponenter}
                    juridiskEnhetMedUnderenheter={organisasjon}
                    history={history}
                    valgtOrganisasjon={valgtOrganisasjon}
                    erApen={erApen}
                    setErApen={setErApen}
                    juridiskEnhetTrykketPaa={juridiskEnhetTrykketPaa}
                    setJuridiskEnhetTrykketPaa={setJuridiskEnhetTrykketPaa}
                    hover={hover}
                    setHover={setHover}
                    erSok={erSok}
                    ref={ref}

                />
            ))
                : <Normaltekst>Ingenting</Normaltekst>
            }
        </>
    );
};

export default Menyvalg;
