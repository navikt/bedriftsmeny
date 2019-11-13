import React, { FunctionComponent, useState } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Virksomhetsvelger, { VirksomhetsvelgerProps } from './Virksomhetsvelger/Virksomhetsvelger';
import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from './Organisasjon';
import './bedriftsmeny.less';
import { History } from 'history';
import { Collapse } from 'react-collapse';

interface EgneProps {
    sidetittel?: string;
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
    history: History;
}

type AlleProps = EgneProps & VirksomhetsvelgerProps;

const Bedriftsmeny: FunctionComponent<AlleProps> = (props) => {
    const { sidetittel = 'Arbeidsgiver', ...virksomhetsvelgerProps } = props;

    const visVirksomhetsvelger =
        virksomhetsvelgerProps.organisasjonstre === undefined ||
        virksomhetsvelgerProps.organisasjonstre.length > 0;

    return (
        <nav className="bedriftsmeny">
            <div className="bedriftsmeny__inner">
                <Innholdstittel className="bedriftsmeny__tittel">{sidetittel}</Innholdstittel>
                {visVirksomhetsvelger && <Virksomhetsvelger {...virksomhetsvelgerProps} />}
            </div>
        </nav>
    );
};

export default Bedriftsmeny;
