import React, { FunctionComponent } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Virksomhetsvelger, { VirksomhetsvelgerProps } from './Virksomhetsvelger/Virksomhetsvelger';
import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from './Organisasjon';
import './bedriftsmeny.less';

interface EgneProps {
    sidetittel?: string;
    organisasjoner: Organisasjon[];
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
}

type AlleProps = EgneProps & VirksomhetsvelgerProps;

const Bedriftsmeny: FunctionComponent<AlleProps> = (props) => {
    const { sidetittel = 'Arbeidsgiver', ...virksomhetsvelgerProps } = props;

    return (
        <nav className="bedriftsmeny">
            <Innholdstittel>{sidetittel}</Innholdstittel>
            <Virksomhetsvelger {...virksomhetsvelgerProps} />
        </nav>
    );
};

export default Bedriftsmeny;
