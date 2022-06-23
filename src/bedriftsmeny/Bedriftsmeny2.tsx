import React from "react";
import "./Bedriftsmeny2.less";
import {Innholdstittel} from "nav-frontend-typografi";

interface Props{
    tittel:string,
    virksomhetsvelger: JSX.Element|null,
    bjelle:JSX.Element
}

export const Bedriftsmeny2 = (props:Props) =>
    <div className="bedriftsmeny2">
            <div className="bedriftsmeny2__content">
                <div className="bedriftsmeny2__tittel">
                    <Innholdstittel style={{fontSize:"32px"}}>{props.tittel}</Innholdstittel>
                </div>
                <div className="bedriftsmeny2__widgets">
                    <div className="bedriftsmeny2__virksomhetsvelger">
                        <div>
                            {props.virksomhetsvelger}
                        </div>
                    </div>
                    <div className="bedriftsmeny2__bjelle">
                        {props.bjelle}
                    </div>
                </div>
            </div>
        </div>
