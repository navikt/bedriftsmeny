import {ListeMedJuridiskeEnheter, Organisasjon, tomAltinnOrganisasjon} from "./Organisasjon";

export async function hentAlleJuridiskeEnheter(listeMedJuridiskeOrgnr: string[]): Promise<Organisasjon[]> {
    const listerMedDefinerteOrgnr = listeMedJuridiskeOrgnr.filter(orgnr => {
        return orgnr !== null;
    });
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listerMedDefinerteOrgnr.filter(
        (juridiskEnhet, index) => listeMedJuridiskeOrgnr.indexOf(juridiskEnhet) === index
    );
    distinkteJuridiskeEnhetsnr.forEach(orgnr => {
        if (distinkteJuridiskeEnhetsnr.indexOf(orgnr) === 0) {
            url += orgnr;
        } else {
            url += ',' + orgnr;
        }
    });
    let respons = await fetch(url);
    if (respons.ok && distinkteJuridiskeEnhetsnr.length > 0) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        if (
            distinkteJuridiskeEnheterFraEreg._embedded &&
            distinkteJuridiskeEnheterFraEreg._embedded.enheter.length > 0
        ) {
            const distinkteJuridiskeEnheter: Organisasjon[] = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(
                orgFraEereg => {
                    const jurOrg: Organisasjon = {
                        ...tomAltinnOrganisasjon,
                        Name: orgFraEereg.navn,
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                        Type: 'Business'

                    };
                    return jurOrg;
                }
            );
            return distinkteJuridiskeEnheter;
        }
    }
    return [];
}