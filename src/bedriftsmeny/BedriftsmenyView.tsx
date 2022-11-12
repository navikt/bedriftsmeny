import React, { ReactNode } from 'react';
import { Heading } from '@navikt/ds-react';

interface Props {
    tittel?: string | JSX.Element;
    virksomhetsvelger: JSX.Element;
    bjelle?: JSX.Element | ReactNode;
}

export const BedriftsmenyView = (props: Props) => (
    <div className="bedriftsmeny">
        <div className="bedriftsmeny__content">
            <div className="bedriftsmeny__tittel">
                {typeof props.tittel === 'string' ? (
                    <Heading size="large">{props.tittel}</Heading>
                ) : (
                    props.tittel
                )}
            </div>
            <div className="bedriftsmeny__widgets">
                {props.virksomhetsvelger}
                {props.bjelle ? <div>{props.bjelle}</div> : null}
            </div>
        </div>
    </div>
);
