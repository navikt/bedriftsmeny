import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../organisasjon';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import { endreTabIndexAlleOrganisasjonerOgSokefelt } from './pilnavigerinsfunksjoner';

interface Props {
    valgtOrganisasjon: Organisasjon;
    menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[];
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    erSok: boolean;
    organisasjonIFokus: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    setForrigeOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    history: History;
}

const Menyvalg: FunctionComponent<Props> = (props) => {
    const {
        menyKomponenter = [],
        history,
        valgtOrganisasjon,
        setErApen,
        erSok,
        erApen,
        organisasjonIFokus,
        setOrganisasjonIFokus,
        forrigeOrganisasjonIFokus,
        setForrigeOrganisasjonIFokus
    } = props;
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const navarendeTabIndex = erApen ? 0 : -1;
        endreTabIndexAlleOrganisasjonerOgSokefelt(menyKomponenter, navarendeTabIndex);
    }, [erApen, menyKomponenter]);

    const lukkMenyOnTabPaNedersteElement = (
        organisasjonsnummer: string,
        erJuridiskEnhetSomViserUnderenheter: boolean
    ) => {
        const nedersteElement = menyKomponenter[menyKomponenter.length - 1];
        const erNedersteJuridiskeEnhet =
            nedersteElement.JuridiskEnhet.OrganizationNumber === organisasjonsnummer;
        const nedersteUnderenhet =
            nedersteElement.Underenheter[nedersteElement.Underenheter.length - 1];
        const erNedersteUnderenhet = nedersteUnderenhet.OrganizationNumber === organisasjonsnummer;
        if (
            (erNedersteJuridiskeEnhet && !erJuridiskEnhetSomViserUnderenheter) ||
            erNedersteUnderenhet
        ) {
            setErApen(false);
        }
    };

    return (
        <div id={'virksomhetsvelger-id'}>
            {menyKomponenter.map((organisasjon) => (
                <Underenhetsvelger
                    menyKomponenter={menyKomponenter}
                    setOrganisasjonIFokus={setOrganisasjonIFokus}
                    setForrigeOrganisasjonIFokus={setForrigeOrganisasjonIFokus}
                    setErApen={setErApen}
                    organisasjonIFokus={organisasjonIFokus}
                    forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                    lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
                    key={organisasjon.JuridiskEnhet.OrganizationNumber}
                    juridiskEnhetMedUnderenheter={organisasjon}
                    history={history}
                    valgtOrganisasjon={valgtOrganisasjon}
                    erApen={erApen}
                    hover={hover}
                    setHover={setHover}
                    erSok={erSok}
                />
            ))}
        </div>
    );
};

export default Menyvalg;
