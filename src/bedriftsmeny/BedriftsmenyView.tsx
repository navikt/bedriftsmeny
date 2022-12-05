import React, {ReactNode} from 'react';
import {BodyShort, Heading} from '@navikt/ds-react';
import {MSAIkon} from "./MSAIkon";

interface Props {
    tittel?: string | JSX.Element;
    undertittel?: string;
    piktogram?: JSX.Element;
    virksomhetsvelger: JSX.Element;
    bjelle?: JSX.Element | ReactNode;
}

export const BedriftsmenyView = (props: Props) => (
    <div className="navbm-bedriftsmeny">
        <div className="navbm-container">
            <div className="navbm-piktogram">
                {props.piktogram ?? <MSAIkon/>}
            </div>
            <div className="navbm-innhold">
                <div className="navbm-innhold-header">
                    {typeof props.tittel === 'string' ? (
                        <Heading size="xlarge">{props.tittel}</Heading>
                    ) : (
                        props.tittel
                    )}
                    {props.undertittel ?
                        <div className="navbm-innhold-footer">
                            <BodyShort size="small">{props.undertittel.toUpperCase()}</BodyShort>
                        </div>
                        : null
                    }
                </div>
                <div className="navbm-widgets">
                    {props.virksomhetsvelger}
                    {props.bjelle ? <div>{props.bjelle}</div> : null}
                </div>
            </div>
        </div>
    </div>
);
