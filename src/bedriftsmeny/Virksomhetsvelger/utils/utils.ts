import {Organisasjon, JuridiskEnhetMedUnderEnheterArray} from '../../organisasjon';
import {useLocation, useNavigate} from "react-router-dom";

const ORGNUMMER_PARAMETER = 'bedrift';
const ORGNUMMER_LOCAL_STORE = 'virksomhetsvelger_bedrift';

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

export type OrgnrSearchParamType = () => [string | null, (orgnr: string) => void]

export const useOrgnrSearchParam: OrgnrSearchParamType = () => {
    const location = useLocation();
    const searchParam = new URLSearchParams(location.search)
    const currentOrgnr = searchParam.get(ORGNUMMER_PARAMETER)
    const navigate = useNavigate();

    const setOrgnr = (orgnr: string) => {
        if (currentOrgnr !== orgnr) {
            if (orgnr === null) {
                searchParam.delete(ORGNUMMER_PARAMETER);
            } else {
                searchParam.set(ORGNUMMER_PARAMETER, orgnr);
            }
            navigate({search: searchParam.toString()})
        }
    }

    return [currentOrgnr, setOrgnr]
}