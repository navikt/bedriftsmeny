import React, { FunctionComponent, useState } from 'react';
import { History } from 'history';
import { Menu, Wrapper, WrapperState } from 'react-aria-menubutton';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../../../Organisasjon';
import { settOrgnummerIUrl } from '../../utils';
import Underenhet from './Underenhet/Underenhet';
import './Underenhetsvelger.less';
import UnderenhetsVelgerMenyButton from "./UnderenhetsVelgerMenyButton/UnderenhetsVelgerMenyButton";

interface Props {
    history: History;
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    key: string;
}

const Underenhetsvelger: FunctionComponent<Props> = ({ history, juridiskEnhetMedUnderenheter, key }) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const onUnderenhetSelect = (value: string) => {
        settOrgnummerIUrl(value, history);
    };

    const onMenuToggle = ({ isOpen }: WrapperState) => {
        setVisUnderenheter(isOpen);
    };

    const underEnheter = juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon) => (
            <Underenhet key={organisasjon.Name} underEnhet={organisasjon} />
        ));

    return (
            <Wrapper
                className="underenhetsvelger"
                onSelection={onUnderenhetSelect}
                closeOnSelection={false}
                onMenuToggle={onMenuToggle}>
                    <UnderenhetsVelgerMenyButton visUnderenheter={visUnderenheter} juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter} />
                <Menu className={'underenhetsvelger__menyvalg-wrapper'}>
                   <> {underEnheter}</>
                </Menu>
            </Wrapper>
    );
};

export default Underenhetsvelger;