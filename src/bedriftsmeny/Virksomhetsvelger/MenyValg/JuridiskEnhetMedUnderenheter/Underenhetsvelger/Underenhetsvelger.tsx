import React, { FunctionComponent, useState } from 'react';
import { Collapse } from 'react-collapse';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
// import { withRouter, RouteComponentProps } from 'react-router';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';

import Underenhet from '../../Underenhet/Underenhet';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../Organisasjon';
import './Underenhetsvelger.less';

interface EgneProps {
    hovedOrganisasjon: JuridiskEnhetMedUnderEnheterArray;
}

const Underenhetsvelger: FunctionComponent<EgneProps> = ({ hovedOrganisasjon }) => {
    const settUrl = (orgnr: string) => {
        // history.push('/' + orgnr);
    };

    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const label = `${visUnderenheter ? 'Skjul' : 'Vis'} ${
        hovedOrganisasjon.Underenheter.length
    } underenheter`;

    const Chevron = visUnderenheter ? OppChevron : NedChevron;

    return (
        <div className="underenhetsvelger">
            <Wrapper
                className="underenhetsvelger__wrapper"
                onSelection={(value: string) => settUrl(value)}
                closeOnSelection={false}
                onMenuToggle={({ isOpen }) => {
                    setVisUnderenheter(isOpen);
                    if (hovedOrganisasjon.JuridiskEnhet.Type !== 'Enterprise') {
                        settUrl(hovedOrganisasjon.JuridiskEnhet.OrganizationNumber);
                    }
                }}>
                <Button className={'underenhetsvelger__button'}>
                    <div className="underenhetsvelger__button__chevron">
                        <Chevron />
                    </div>
                    {label}
                </Button>

                <Collapse isOpened>
                    <Menu className={'underenhetsvelger__menyvalg-wrapper'}>
                        {hovedOrganisasjon.Underenheter.map((organisasjon: Organisasjon) => (
                            <Underenhet key={organisasjon.Name} underEnhet={organisasjon} />
                        ))}
                    </Menu>
                </Collapse>
            </Wrapper>
        </div>
    );
};

export default Underenhetsvelger;
