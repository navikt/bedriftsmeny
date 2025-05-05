import React, {ReactNode} from 'react';
import { Heading} from '@navikt/ds-react';

interface Props {
    tittel?: string | React.JSX.Element;
    virksomhetsvelger: React.JSX.Element;
    bjelle?: React.JSX.Element | ReactNode;
}

export const BedriftsmenyView = (props: Props) => (
    <div className="navbm-bedriftsmeny">
        <div className="navbm-container">
            <div className="navbm-innhold">
                <div className="navbm-innhold-header">
                    {typeof props.tittel === 'string' ? (
                        <Heading size="xlarge">{props.tittel}</Heading>
                    ) : (
                        props.tittel
                    )}
                </div>
                <div className="navbm-widgets">
                    {props.virksomhetsvelger}
                    {props.bjelle ? <div>{props.bjelle}</div> : null}
                </div>
            </div>
        </div>
    </div>
);
