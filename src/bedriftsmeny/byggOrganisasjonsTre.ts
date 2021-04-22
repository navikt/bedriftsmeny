import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './organisasjon';
import { hentAlleJuridiskeEnheter } from './hentAlleJuridiskeEnheter';

const erHovedenhet = (organisasjon: Organisasjon): boolean =>
    !!organisasjon.OrganizationNumber &&
    (organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI');

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !!organisasjon.OrganizationNumber
    && ['BEDR', 'AAFY'].includes(organisasjon.OrganizationForm);

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    organisasjoner = organisasjoner.sort((a, b) => a.Name.localeCompare(b.Name))

    const hovedenheter = organisasjoner.filter(erHovedenhet);
    const underenheter = organisasjoner.filter(erUnderenhet);

    const hovedenhetersOrgnr = new Set(hovedenheter.map(enhet => enhet.OrganizationNumber));
    const manglendeHovedenheterOrgnr = underenheter
        .filter(org => !hovedenhetersOrgnr.has(org.ParentOrganizationNumber))
        .map(org => org.ParentOrganizationNumber);

    hovedenheter.push(... await hentAlleJuridiskeEnheter(manglendeHovedenheterOrgnr))

    return hovedenheter
        .map(hovedenhet => ({
                JuridiskEnhet: hovedenhet,
                Underenheter: underenheter.filter(underenhet =>
                    underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber
                ),
                SokeresultatKunUnderenhet: false
            })
        )
        .filter(orgtre => orgtre.Underenheter.length > 0)
        .sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name));
}
