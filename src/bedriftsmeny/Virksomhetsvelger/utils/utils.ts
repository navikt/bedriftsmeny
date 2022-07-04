import { History } from 'history';

import { Organisasjon, JuridiskEnhetMedUnderEnheterArray } from '../../organisasjon';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const ORGNUMMER_PARAMETER = 'bedrift';
const ORGNUMMER_LOCAL_STORE = 'virksomhetsvelger_bedrift';

export const settOrgnummerIUrl = (orgnummer: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(ORGNUMMER_PARAMETER, orgnummer);

    const { search } = currentUrl;
    history.replace({ ...history.location, search });
};

export const getLocalStorageOrgnr = (): string | null =>
    window.localStorage.getItem(ORGNUMMER_LOCAL_STORE);

export const setLocalStorageOrgnr = (orgnr: string): void =>
    window.localStorage.setItem(ORGNUMMER_LOCAL_STORE, orgnr);

export const hentUnderenheter = (organisasjonstre: JuridiskEnhetMedUnderEnheterArray[]) =>
    organisasjonstre.reduce(
        (organisasjoner: Organisasjon[], parentOrg) => [
            ...organisasjoner,
            ...parentOrg.Underenheter
        ],
        []
    );

export const useOrgnriURLsetter = (orgnummer: string) => {
    const navigate = useNavigate();

    useEffect(()=>{
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set(ORGNUMMER_PARAMETER, orgnummer);
        const { search } = currentUrl
        navigate({search},{replace:true})
        },[orgnummer]
    )
}

const useOrgnrNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return ((orgnr: string | undefined) => {
        const currentOrgnr = new URLSearchParams(location.search)
        if (orgnr == undefined){
            currentOrgnr.delete(ORGNUMMER_PARAMETER);
        }
        else {
            currentOrgnr.set(ORGNUMMER_PARAMETER, orgnr);
        }
        navigate({search:currentOrgnr.toString()})
    })
}


export const useOrgnrSearchParam = () => {
    const location = useLocation();
    const currentOrgnr= new URLSearchParams(location.search).get("bedrift")
    const [orgnr, setOrgnr] = useState<string | undefined>(currentOrgnr??undefined);
    const orgnrNavigate = useOrgnrNavigate();

    useEffect(() => {
        if (currentOrgnr !== orgnr){
            orgnrNavigate(orgnr)
        }
    }, [orgnr])

    return [orgnr, setOrgnr]
}