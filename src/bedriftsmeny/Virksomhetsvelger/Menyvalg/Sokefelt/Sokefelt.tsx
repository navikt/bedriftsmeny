import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';

import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../organisasjon';
import Forstørrelsesglass from './Forstørrelsesglass';
import { erPilNavigasjon, setfokusPaMenyKnapp } from '../pilnavigerinsfunksjoner';
import { settOrgnummerIUrl } from '../../utils/utils';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    juridiskEnhetTilValgtOrganisasjon: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[] | undefined;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
    setErApen: (apen: boolean) => void;
    valgtOrganisasjon: Organisasjon;
}

const Sokefelt: FunctionComponent<Props> = ({
    soketekst,
    onChange,
    treffPåOrganisasjoner,
    forrigeOrganisasjonIFokus,
    juridiskEnhetTilValgtOrganisasjon,
    menyKomponenter,
    setOrganisasjonIFokus,
    history,
    setErApen,
    valgtOrganisasjon
}) => {
    const [ariaTekst, setTekst] = useState('Søk etter virksomhet');

    useEffect(() => {
        const underenheter: Organisasjon[] = [];
        treffPåOrganisasjoner?.forEach((juridiskEnhet) =>
            underenheter.push.apply(underenheter, juridiskEnhet.Underenheter)
        );
        if (soketekst.length === 0) {
            setTekst('');
        } else if (treffPåOrganisasjoner?.length === 0) {
            setTekst(`Ingen treff for \"${soketekst}\"`);
        } else if (treffPåOrganisasjoner) {
            setTekst(`${underenheter.length} treff for \"${soketekst}\"`);
        }
    }, [soketekst, treffPåOrganisasjoner]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onEnter();
        }
        if (key === 'ArrowUp' || key === 'Up') {
            setfokusPaMenyKnapp();
        }
        if (key === 'ArrowDown' || key === 'Down') {
            settFokusPaForsteEnhet();
        }
    };

    const onEnter = () => {
        if (
            soketekst.length > 0 &&
            treffPåOrganisasjoner &&
            treffPåOrganisasjoner?.length > 0 &&
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

    const settFokusPaForsteEnhet = () => {
        if (
            menyKomponenter &&
            ((treffPåOrganisasjoner && treffPåOrganisasjoner?.length > 0) || soketekst.length === 0)
        ) {
            const blarOppTilSøkefeltOgNedTilMeny =
                forrigeOrganisasjonIFokus.OrganizationNumber ===
                menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const valgtJuridiskEnhetErFørsteILista =
                juridiskEnhetTilValgtOrganisasjon.OrganizationNumber ===
                menyKomponenter[0].JuridiskEnhet.OrganizationNumber;
            const skalBlaTilFørsteElementIMenyKomponenter =
                (blarOppTilSøkefeltOgNedTilMeny && !valgtJuridiskEnhetErFørsteILista) ||
                soketekst.length > 0;

            if (skalBlaTilFørsteElementIMenyKomponenter) {
                setOrganisasjonIFokus(menyKomponenter[0].JuridiskEnhet);
            } else {
                setOrganisasjonIFokus(juridiskEnhetTilValgtOrganisasjon);
            }
        }
    };

    return (
        <div className="bedriftsmeny-sokefelt">
            <Input
                autoComplete="off"
                id="bedriftsmeny-sokefelt"
                className="bedriftsmeny-sokefelt__felt"
                type="search"
                label=""
                aria-label={'Søk'}
                aria-haspopup={false}
                value={soketekst}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Søk"
                role="searchbox"
                onKeyDown={(e) => {
                    if (erPilNavigasjon(e.key) || e.key === 'Enter') {
                        onKeyDown(e.key);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            />
            <Normaltekst
                className={'bedriftsmeny-sokefelt__skjult-aria-live-sokeresultat'}
                aria-live="assertive">
                {ariaTekst}
            </Normaltekst>
            <div className="bedriftsmeny-sokefelt__ikon">
                {soketekst.length === 0 ? <Forstørrelsesglass /> : null}
            </div>
        </div>
    );
};

export default Sokefelt;
