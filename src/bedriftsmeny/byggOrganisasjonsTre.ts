import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './organisasjon';
import { hentAlleJuridiskeEnheter } from './hentAlleJuridiskeEnheter';

const gyldigeUnderenheter = ['BEDR', 'AAFY'];

const erGyldigUnderenhet = (form: string) => {
    return gyldigeUnderenheter.includes(form);
};

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI';
    });
    const underenheter = organisasjoner.filter(
        (organisasjon) =>
            erGyldigUnderenhet(organisasjon.OrganizationForm) && organisasjon.OrganizationNumber
    );
    const jurisikeEnheterOrgnr = juridiskeEnheter.map((jurorg) => jurorg.OrganizationNumber);
    const underenheterMedJuridiskEnhet = organisasjoner.filter((org) => {
        return jurisikeEnheterOrgnr.includes(org.ParentOrganizationNumber);
    });

    const underenheterUtenJuridiskEnhet = organisasjoner.filter((org) => {
        return (
            !underenheterMedJuridiskEnhet.includes(org) && erGyldigUnderenhet(org.OrganizationForm)
        );
    });
    const finnJuridiskeEnheter = async (underEnheterUtenJuridisk: Organisasjon[]) => {
        const juridiskeEnheterUtenTilgang: Organisasjon[] = await hentAlleJuridiskeEnheter(
            underenheterUtenJuridiskEnhet.map((org) => org.ParentOrganizationNumber)
        );
        return juridiskeEnheterUtenTilgang;
    };
    if (underenheterUtenJuridiskEnhet.length > 0) {
        await finnJuridiskeEnheter(underenheterUtenJuridiskEnhet).then(
            (juridiskeEnheterUtenTilgang) => {
                juridiskeEnheter.push(...juridiskeEnheterUtenTilgang);
            }
        );
    }
    const orgtre = settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter);
    return orgtre.sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name));
}

const settSammenJuridiskEnhetMedUnderenheter = (
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
    const organisasjonsTre: JuridiskEnhetMedUnderEnheterArray[] = juridiskeEnheter.map(
        (juridiskEnhet) => {
            const tilhorendeUnderenheter = underEnheter.filter(
                (underenhet) =>
                    underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            );
            const resultat = {
                JuridiskEnhet: juridiskEnhet,
                Underenheter: tilhorendeUnderenheter,
                SokeresultatKunUnderenhet: false
            };
            return resultat;
        }
    );
    return organisasjonsTre.filter((orgtre) => orgtre.Underenheter.length > 0);
};
