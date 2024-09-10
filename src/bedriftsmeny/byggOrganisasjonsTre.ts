import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from './organisasjon';
import {hentAlleJuridiskeEnheter} from './hentAlleJuridiskeEnheter';

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !!organisasjon.OrganizationNumber
    && ['BEDR', 'AAFY'].includes(organisasjon.OrganizationForm);

const sorted = <T extends any>(array: T[], on: (e: T) => string): T[] =>
    [...array].sort((a, b) => on(a).localeCompare(on(b)));

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    organisasjoner = sorted(organisasjoner, org => org.Name);

    const underenheter = organisasjoner.filter(erUnderenhet);

    const alleOrgnr = new Set(organisasjoner.map(enhet => enhet.OrganizationNumber));
    const manglendeHovedenheterOrgnr = underenheter
        .filter(org => !alleOrgnr.has(org.ParentOrganizationNumber))
        .map(org => org.ParentOrganizationNumber);

    const alleParentsOrgnr = new Set(underenheter.map(enhet => enhet.ParentOrganizationNumber))
    const alleParents = Array.from(alleParentsOrgnr)
        .map(parentOrgnr => {
            return organisasjoner.find(({OrganizationNumber}) => parentOrgnr === OrganizationNumber);
        })
        .filter((e) : e is Organisasjon => e !== undefined)

    const hovedenheter = [...alleParents, ...await hentAlleJuridiskeEnheter(manglendeHovedenheterOrgnr)]

    const resultat = hovedenheter.map(hovedenhet => ({
            JuridiskEnhet: hovedenhet,
            Underenheter: underenheter.filter(underenhet =>
                underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber
            ),
            SokeresultatKunUnderenhet: false
        })
    )
        .filter(orgtre => orgtre.Underenheter.length > 0);
    return sorted(resultat, a => a.JuridiskEnhet.Name);
}
