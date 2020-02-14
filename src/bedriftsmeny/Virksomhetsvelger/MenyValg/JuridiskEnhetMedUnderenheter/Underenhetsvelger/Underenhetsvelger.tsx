import React, { FunctionComponent, useState } from 'react';
import { History } from 'history';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Button, Menu, Wrapper, WrapperState } from 'react-aria-menubutton';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../../Organisasjon';
import { settOrgnummerIUrl } from '../../../utils';
import Underenhet from '../../Underenhet/Underenhet';
import './Underenhetsvelger.less';

interface Props {
    hovedOrganisasjon: JuridiskEnhetMedUnderEnheterArray;
    history: History;
}

const Underenhetsvelger: FunctionComponent<Props> = ({ history, hovedOrganisasjon }) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const label = `${visUnderenheter ? 'Skjul' : 'Vis'} ${
        hovedOrganisasjon.Underenheter.length
    } underenheter`;

    const onUnderenhetSelect = (value: string) => {
        settOrgnummerIUrl(value, history);
    };

    const onMenuToggle = ({ isOpen }: WrapperState) => {
        setVisUnderenheter(isOpen);
    };

    const Chevron = visUnderenheter ? OppChevron : NedChevron;

    return (
        <div className="underenhetsvelger">
            <Wrapper
                className="underenhetsvelger__wrapper"
                onSelection={onUnderenhetSelect}
                closeOnSelection={false}
                onMenuToggle={onMenuToggle}>
                <Button className={'underenhetsvelger__button'}>
                    <div className="underenhetsvelger__button__chevron">
                        <Chevron />
                    </div>
                    {label}
                </Button>
                <Menu className={'underenhetsvelger__menyvalg-wrapper'}>
                    {hovedOrganisasjon.Underenheter.map((organisasjon: Organisasjon) => (
                        <Underenhet key={organisasjon.Name} underEnhet={organisasjon} />
                    ))}
                </Menu>
            </Wrapper>
        </div>
    );
};

export default Underenhetsvelger;