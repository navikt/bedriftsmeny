import React, {FunctionComponent, useEffect, useState} from 'react';
import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from './organisasjon';
import {byggOrganisasjonstre} from './byggOrganisasjonsTre';
import Virksomhetsvelger from './Virksomhetsvelger/Virksomhetsvelger';
import {AmplitudeClient} from "amplitude-js";
import {AmplitudeProvider} from "./amplitudeProvider";
import {VirksomhetsvelgerProvider} from './Virksomhetsvelger/VirksomhetsvelgerProvider';
import {BedriftsmenyView} from "./BedriftsmenyView";

interface EgneProps {
    sidetittel?: string | JSX.Element;
    organisasjoner?: Organisasjon[];
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

    return <BedriftsmenyView
        tittel={sidetittel}
        virksomhetsvelger={visVirksomhetsvelger ?
            <AmplitudeProvider amplitudeClient={props.amplitudeClient}>
                <VirksomhetsvelgerProvider
                    organisasjonstre={organisasjonstre ?? []}
                >
                    <Virksomhetsvelger onOrganisasjonChange={props.onOrganisasjonChange}/>
                </VirksomhetsvelgerProvider>
            </AmplitudeProvider> : <></>
        }
        bjelle={props.children}
    />
};

export default Bedriftsmeny;
