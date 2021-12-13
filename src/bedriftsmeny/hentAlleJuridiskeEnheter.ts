import { ListeMedJuridiskeEnheter, Organisasjon, tomAltinnOrganisasjon } from './organisasjon';

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgnr: string[]
): Promise<Organisasjon[]> {
    if (window.location.hostname.includes('localhost')) {
        return lagListeMedMockedeJuridiskeEnheter(listeMedJuridiskeOrgnr);
    }

    const orgnr = listeMedJuridiskeOrgnr
            .filter(orgnr => orgnr !== null)
            .filter((juridiskEnhet, index) =>
                listeMedJuridiskeOrgnr.indexOf(juridiskEnhet) === index
            );

    if (orgnr.length <= 0) {
        return [];
    }

    let respons
    try {
        respons = await fetch(
            `https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=${orgnr.join(",")}`
        );
    } catch (e) {
        return [];
    }
    if (!respons.ok) {
        return [];
    }

    const responsBody: ListeMedJuridiskeEnheter = await respons.json();
    const enheter = responsBody._embedded?.enheter ?? [];
    return enheter.map(eeregEnhet => lagOrganisasjon(eeregEnhet.organisasjonsnummer, eeregEnhet.navn));
}

const lagOrganisasjon = (orgnr: string, navn: string): Organisasjon => ({
    ...tomAltinnOrganisasjon,
    Name: navn,
    OrganizationNumber: orgnr,
    Type: 'Business',
});

const lagListeMedMockedeJuridiskeEnheter = (listeMedJuridiskeOrgnr: string[]) =>
    listeMedJuridiskeOrgnr.map(orgnr => lagOrganisasjon(orgnr, 'MOCK ORGANISASjON'));
