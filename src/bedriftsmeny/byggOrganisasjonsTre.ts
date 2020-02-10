import {
    JuridiskEnhetMedUnderEnheterArray,
    ListeMedJuridiskeEnheter,
    Organisasjon,
    tomAltinnOrganisasjon
} from "./Organisasjon";

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    const underenheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.OrganizationForm === 'BEDR' && organisasjon.OrganizationNumber;
    });
    const jurEnheterOrgNr = juridiskeEnheter.map(jurorg => jurorg.OrganizationNumber);
    const underEnheterMedJuridiskEnhet = organisasjoner.filter(org => {
        return jurEnheterOrgNr.includes(org.ParentOrganizationNumber);
    });

    const underEnheterUtenJuridiskEnhet = organisasjoner.filter(org => {
        return !underEnheterMedJuridiskEnhet.includes(org) && org.OrganizationForm === 'BEDR';
    });
    const finnJuridiskeEnheter = async (underEnheterUtenJuridisk: Organisasjon[]) => {
        const juridiskeEnheterUtenTilgang: Organisasjon[] = await hentAlleJuridiskeEnheter(
            underEnheterUtenJuridisk.map(org => org.ParentOrganizationNumber)
        );
        return juridiskeEnheterUtenTilgang;
    };
    if (underEnheterUtenJuridiskEnhet.length>0) {
        finnJuridiskeEnheter(underEnheterUtenJuridiskEnhet).then(juridiskeEnheterUtenTilgang => {juridiskeEnheter.push(...juridiskeEnheterUtenTilgang);
        });
    }
    const orgtre = settSammenJuridiskEnhetMedUnderOrganisasjoner(juridiskeEnheter, underenheter);
    return orgtre.sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name));
}

const settSammenJuridiskEnhetMedUnderOrganisasjoner = (
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
    console.log("Skal sette sammen tre: ", juridiskeEnheter);
    console.log("underenheter: ", underEnheter);
    const organisasjonsTre: JuridiskEnhetMedUnderEnheterArray[] = juridiskeEnheter.map(juridiskEnhet => {
        const underenheter = underEnheter.filter(
            underenhet => underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
        );
        const resultat = {
            JuridiskEnhet: juridiskEnhet,
            Underenheter: underenheter
        };
        return resultat;
    });
    return organisasjonsTre.filter(orgtre => orgtre.Underenheter.length > 0);
};

export async function hentAlleJuridiskeEnheter(listeMedJuridiskeOrgNr: string[]): Promise<Organisasjon[]> {
    const listerMedDefinerteOrgNr = listeMedJuridiskeOrgNr.filter(orgnr => {
        return orgnr !== null;
    });
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listerMedDefinerteOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index
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
                        OrganizationNumber: orgFraEereg.organisasjonsnummer
                    };
                    return jurOrg;
                }
            );
            return distinkteJuridiskeEnheter;
        }
    }
    return [];
}
