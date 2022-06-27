import React, {ReactNode} from "react";
import "./BedriftsmenyView.less";
import {Innholdstittel} from "nav-frontend-typografi";

interface Props {
    tittel?: string | JSX.Element,
    virksomhetsvelger: JSX.Element,
    bjelle?: JSX.Element | ReactNode,
}

export const BedriftsmenyView = (props: Props) =>
    <div className="bedriftsmeny">
        <div className="bedriftsmeny__content">
            <div className="bedriftsmeny__tittel">
                {typeof props.tittel === "string" ? <Innholdstittel
                >{props.tittel}</Innholdstittel> : props.tittel
                }
            </div>
            <div className="bedriftsmeny__widgets">
                <div className="bedriftsmeny__virksomhetsvelger">
                    <div>
                        {props.virksomhetsvelger}
                    </div>
                </div>
                {props.bjelle ? <div>
                    {props.bjelle}
                </div> : null}

            </div>
        </div>
    </div>

