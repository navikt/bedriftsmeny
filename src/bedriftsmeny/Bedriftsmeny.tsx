import React, {FunctionComponent, useEffect, useState} from 'react';
import {History} from 'history';

import {Innholdstittel} from 'nav-frontend-typografi';

import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from './organisasjon';
import {byggOrganisasjonstre} from './byggOrganisasjonsTre';
import Virksomhetsvelger from './Virksomhetsvelger/Virksomhetsvelger';
import './Bedriftsmeny.less';
import {AmplitudeClient} from "amplitude-js";
import {AmplitudeProvider} from "./amplitudeProvider";

interface EgneProps {
    sidetittel?: string | JSX.Element;
    organisasjoner?: Organisasjon[];
    history: History;
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
    amplitudeClient?: AmplitudeClient;
}

const Bedriftsmeny: FunctionComponent<EgneProps> = (props) => {
    const {sidetittel = 'Arbeidsgiver'} = props;
    const [organisasjonstre, setOrganisasjonstre] = useState<JuridiskEnhetMedUnderEnheterArray[] | undefined>(undefined);

    useEffect(() => {
        if (props.organisasjoner && props.organisasjoner.length > 0) {
            byggOrganisasjonstre(props.organisasjoner).then(nyttOrganisasjonstre => {
                    if (nyttOrganisasjonstre.length > 0) {
                        setOrganisasjonstre(nyttOrganisasjonstre);
                    }
                }
            );
        }
    }, [props.organisasjoner]);

    const visVirksomhetsvelger =
        organisasjonstre &&
        organisasjonstre.length > 0 &&
        props.organisasjoner &&
        props.organisasjoner?.length > 0;

    return (
        <div className="bedriftsmeny" role="banner">
            <div className="bedriftsmeny__inner">
                {typeof sidetittel === 'string' ? (
                    <Innholdstittel className="bedriftsmeny__tittel">{sidetittel}</Innholdstittel>
                ) : (
                    <div className="bedriftsmeny__tittel">{sidetittel}</div>
                )}
                {visVirksomhetsvelger && (
                    <AmplitudeProvider amplitudeClient={props.amplitudeClient}>
                        <Virksomhetsvelger
                            history={props.history}
                            onOrganisasjonChange={props.onOrganisasjonChange}
                            organisasjonstre={organisasjonstre}
                        />
                    </AmplitudeProvider>
                )}
                {props.children}
            </div>
        </div>
    );
};

export default Bedriftsmeny;
