import React, { ReactNode } from 'react';
import { Heading } from '@navikt/ds-react';

interface Props {
    tittel?: string | JSX.Element;
    virksomhetsvelger: JSX.Element;
    bjelle?: JSX.Element | ReactNode;
}

export const BedriftsmenyView = (props: Props) => (
    <div className="navbm-bedriftsmeny">
        <div className="navbm-innhold">
            {typeof props.tittel === 'string' ? (
                <Heading size="large">{props.tittel}</Heading>
            ) : (
                props.tittel
            )}
            <div className="navbm-widgets">
                {props.virksomhetsvelger}
                {props.bjelle ? <div>{props.bjelle}</div> : null}
            </div>
        </div>
    </div>
);
