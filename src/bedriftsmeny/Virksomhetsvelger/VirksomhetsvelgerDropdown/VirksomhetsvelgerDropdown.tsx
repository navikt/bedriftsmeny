import { Collapse } from 'react-collapse';
import { Menu } from 'react-aria-menubutton';
import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { Undertittel } from 'nav-frontend-typografi';
import Sokefelt from '../Sokefelt/Sokefelt';
import DefaultMeny from '../MenyValg/DefaultMeny';
import MenyFraSokeresultat from '../MenyValg/MenyFraSokeresultat';
import React from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../Organisasjon';
import { History } from 'history';
import './VirksomhetsvelgerDropdown.less';

interface Props {
    erApen: boolean;
    soketekst: string;
    valgtOrganisasjon: Organisasjon;
    onSoketekstChange: (soketekst: string) => void;
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
    sokeresultat?: JuridiskEnhetMedUnderEnheterArray[];
}

export const VirksomhetsvelgerDropdown: React.FunctionComponent<Props> = (props) => {
    const {
        soketekst,
        erApen,
        valgtOrganisasjon,
        onSoketekstChange,
        organisasjonstre,
        history,
        sokeresultat
    } = props;

    return (
        <div className="virksomhetsvelger-dropdown">
            <Collapse isOpened={erApen} className="heisann">
                <div className="virksomhetsvelger-dropdown__meny-wrapper">
                    <Menu className="virksomhetsvelger-dropdown__meny">
                        <Organisasjonsbeskrivelse
                            brukOverskrift
                            navn={valgtOrganisasjon.Name}
                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                            className="virksomhetsvelger-dropdown__valgtVirksomhet"
                        />
                        <Undertittel className="virksomhetsvelger-dropdown__overskrift">
                            Dine aktører
                        </Undertittel>
                        <Sokefelt soketekst={soketekst} onChange={onSoketekstChange} />
                        <div className="virksomhetsvelger-dropdown__virksomhetsliste">
                            {soketekst.length === 0 ? (
                                <DefaultMeny menyKomponenter={organisasjonstre} history={history} />
                            ) : (
                                <MenyFraSokeresultat ListeMedObjektFraSok={sokeresultat} />
                            )}
                        </div>
                    </Menu>
                </div>
            </Collapse>
        </div>
    );
};
