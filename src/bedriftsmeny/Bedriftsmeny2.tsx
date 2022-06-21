import React, {FunctionComponent, useState} from "react";
import "./Bedriftsmeny2.less";
import {Bjelleikon} from "../bjelleikon";

export const Bedriftsmeny2:FunctionComponent = () => {
    const [tittel, setTittel] = useState("tittel")
    const [virksomhetsvelger, setVirksomhetsvelger] = useState("virksomhetsvelger")

    return <>
    <div className="bedriftsmeny2">
            <div className="bedriftsmeny2__content">

                <div className="bedriftsmeny2__tittel">
                    {tittel}
                </div>

                <div className="bedriftsmeny2__widgets">
                    <div className="bedriftsmeny2__virksomhetsvelger">
                        <div>
                            {virksomhetsvelger}
                        </div>
                    </div>
                    <div className="bedriftsmeny2__bjelle">
                        <Bjelleikon/>
                    </div>
                </div>
            </div>
        </div>
        <input value={tittel} onChange={(e)=>{setTittel(e.target.value)}}/>
        <input value={virksomhetsvelger} onChange={(e)=>{setVirksomhetsvelger(e.target.value)}}/>
    </>;
}