import React, {FunctionComponent, useEffect, useState} from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Virksomhetsvelger from './Virksomhetsvelger/Virksomhetsvelger';
import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from './Organisasjon';
import './bedriftsmeny.less';
import { History } from 'history';
import {byggOrganisasjonstre} from "./byggOrganisasjonsTre";

interface EgneProps {
    sidetittel?: string;
    organisasjoner?: Organisasjon[];
    history: History;
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
}

const Bedriftsmeny: FunctionComponent<EgneProps> = (props) => {
    const { sidetittel = 'Arbeidsgiver' } = props;
    const [organisasjonstre, setOrganisasjonstre] = useState<
        JuridiskEnhetMedUnderEnheterArray[] | undefined
        >(undefined);

    useEffect(() => {
        const byggTre = async (organisasjoner: Organisasjon[]) => {
            const juridiskeenheterMedBarn: JuridiskEnhetMedUnderEnheterArray[] = await byggOrganisasjonstre(
                organisasjoner
            );
            return juridiskeenheterMedBarn;
        };
        if (props.organisasjoner) {
            byggTre(props.organisasjoner).then(juridiskeenheterMedBarn => setOrganisasjonstre(juridiskeenheterMedBarn));
        }
    }, [props.organisasjoner]);

    const visVirksomhetsvelger =
        organisasjonstre === undefined ||
       organisasjonstre.length > 0;

    return (
        <nav className="bedriftsmeny">
            <div className="bedriftsmeny__inner">
                <Innholdstittel className="bedriftsmeny__tittel">{sidetittel}</Innholdstittel>
                {visVirksomhetsvelger && <Virksomhetsvelger history={props.history} onOrganisasjonChange={props.onOrganisasjonChange} organisasjonstre={organisasjonstre} />}
            </div>
        </nav>
    );
};

export default Bedriftsmeny;
