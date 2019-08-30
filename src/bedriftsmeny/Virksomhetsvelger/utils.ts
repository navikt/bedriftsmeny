import { History } from 'history';

const ORGNUMMER_PARAMETER = 'bedrift';

export const settOrgnummerIUrl = (orgnummer: string, history: History) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(ORGNUMMER_PARAMETER, orgnummer);

    const { search } = currentUrl;

    history.replace({ search });
};
