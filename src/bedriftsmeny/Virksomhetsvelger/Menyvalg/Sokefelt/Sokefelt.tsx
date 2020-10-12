import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstørrelsesglass from './Forstørrelsesglass';
import Kryss from './Kryss';
import './Sokefelt.less';
import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from "../../../organisasjon";
import JuridiskEnhetIkon from "../Underenhetsvelger/Organisasjonsbeskrivelse/JuridiskEnhetIkon";

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
    treffPåOrganisasjoner?: JuridiskEnhetMedUnderEnheterArray[];
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange, treffPåOrganisasjoner }) => {
    const sokefeltref = useRef<HTMLDivElement>(null);
    const [arialabelTekst, setArialabelTekst] = useState("Søk etter virksomhet")
    //const arialabelTekst = treffPåOrganisasjoner ? "Søk etter virksomhet" : "Søk etter virksomhet, ingen treff"

    useEffect(() => {
        console.log(treffPåOrganisasjoner)
        if (!treffPåOrganisasjoner?.length && soketekst.length>0) {
            setArialabelTekst("Ingen treff for dette søkeordet")
            console.log("dette skjer ")
        }
        else if (treffPåOrganisasjoner && treffPåOrganisasjoner?.length > 0 ||soketekst.length === 0) {
            setArialabelTekst("")
        }
    }, [soketekst, treffPåOrganisasjoner]);

    const handleKeydown: { (e: KeyboardEvent): void } = (e: KeyboardEvent) => {
        const forsteVirksomhet = document.querySelector('.juridiskenhet--first') as HTMLElement;
        const menyknapp = document.querySelector('#virksomhetsvelger__button') as HTMLElement;
        const node = sokefeltref.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            if (e.key === 'ArrowDown') {
                if (forsteVirksomhet) {
                    forsteVirksomhet.focus();
                }
            }
            if (e.key === 'ArrowUp') {
                if (forsteVirksomhet) {
                    menyknapp.focus();
                }
            }
        }
    };

   const onChangeMedAriaKontroll = (verdi: string) => {
       const sokefelt = document.getElementById("bedriftsmeny-sokefelt")
       if (sokefelt) {
           sokefelt.focus();
       }
       onChange(verdi)
   }

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown, false);
        return () => {
            window.removeEventListener('keydown', handleKeydown, false);
        };
    }, []);

    // @ts-ignore
    // @ts-ignore
    return (
        <div className="bedriftsmeny-sokefelt" ref={sokefeltref}>
            <Input
                aria-describedby = {arialabelTekst}
                className="bedriftsmeny-sokefelt__felt"
                id="bedriftsmeny-sokefelt"
                type="search"
                label=""
                aria-live = {"assertive"}
                aria-label={arialabelTekst}
                value={soketekst}
                onChange={(e) => onChangeMedAriaKontroll(e.target.value)}
                placeholder="Søk"
                tabIndex={-1}
            />
            <div className="bedriftsmeny-sokefelt__ikon">
                {soketekst.length === 0 ? (
                    <Forstørrelsesglass/>
                ) : (
                    <Kryss className="bedriftsmeny-sokefelt__ikon--klikkbart" onClick={() => onChangeMedAriaKontroll('')}/>
                )}
            </div>
        </div>
    );
};

export default Sokefelt;
