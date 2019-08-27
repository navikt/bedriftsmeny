import React, { FunctionComponent, useEffect, useState } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Virksomhetsvelger, { VirksomhetsvelgerProps } from './Virksomhetsvelger/Virksomhetsvelger';
import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from './Organisasjon';
import './bedriftsmeny.less';

interface EgneProps {
    sidetittel?: string;
    organisasjoner: Organisasjon[];
    organisasjonstre?: JuridiskEnhetMedUnderEnheterArray[];
    valgtOrganisasjon: Organisasjon;
}

type AlleProps = EgneProps & VirksomhetsvelgerProps;

const hentBedriftFraUrl = () => new URLSearchParams(window.location.search).get('bedrift');

const Bedriftsmeny: FunctionComponent<AlleProps> = (props) => {
    const { sidetittel = 'Arbeidsgiver', ...virksomhetsvelgerProps } = props;
    const [valgtBedrift, velgBedrift] = useState<string | null>(null);

    useEffect(() => {
        velgBedrift(hentBedriftFraUrl());
    }, [window.location.search]);

    return (
        <nav className="bedriftsmeny">
            <Innholdstittel>{sidetittel}</Innholdstittel>
            <Virksomhetsvelger {...virksomhetsvelgerProps} />
        </nav>
    );
};

export default Bedriftsmeny;
