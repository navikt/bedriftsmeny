import React, { FunctionComponent, useEffect, useState } from 'react';
import { Innholdstittel, Element } from 'nav-frontend-typografi';
import './bedriftsmeny.less';

interface Props {
    sidetittel?: string;
}

const hentBedriftFraUrl = () => new URLSearchParams(window.location.search).get('bedrift');

const Bedriftsmeny: FunctionComponent<Props> = (props) => {
    const { sidetittel = 'Arbeidsgiver' } = props;
    const [valgtBedrift, velgBedrift] = useState<string | null>(null);

    useEffect(() => {
        velgBedrift(hentBedriftFraUrl());
    }, [window.location.search]);

    return (
        <nav className="bedriftsmeny">
            <Innholdstittel>{sidetittel}</Innholdstittel>
            <Element className="bedriftsmeny__bedriftsvelger">
                {valgtBedrift ? valgtBedrift.toUpperCase() : 'N/A'}
            </Element>
        </nav>
    );
};

export default Bedriftsmeny;
