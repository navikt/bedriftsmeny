import React, { FunctionComponent, useState } from 'react';
import { History } from 'history';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../Organisasjon';
import Underenhet from '../../Underenhet/Underenhet';
import './Underenhetsvelger.less';
import { Collapse } from 'react-collapse';

interface Props {
    hovedOrganisasjon: JuridiskEnhetMedUnderEnheterArray;
    history: History;
}

const Underenhetsvelger: FunctionComponent<Props> = ({ history, hovedOrganisasjon }) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const label = `${visUnderenheter ? 'Skjul' : 'Vis'} ${
        hovedOrganisasjon.Underenheter.length
    } underenheter`;

    const Chevron = visUnderenheter ? OppChevron : NedChevron;

    return (
        <div className="underenhetsvelger">
            <div
                className="underenhetsvelger__wrapper"
                onClick={() => setVisUnderenheter(!visUnderenheter)}>
                <div className={'underenhetsvelger__button'}>
                    <div className="underenhetsvelger__button__chevron">
                        <Chevron />
                    </div>
                    {label}
                </div>
                <Collapse isOpened={visUnderenheter}>
                    {hovedOrganisasjon.Underenheter.map((organisasjon: Organisasjon) => (
                        <Underenhet key={organisasjon.Name} underEnhet={organisasjon} />
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export default Underenhetsvelger;
