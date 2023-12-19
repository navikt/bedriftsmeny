![master build](https://github.com/navikt/bedriftsmeny/actions/workflows/ci.yaml/badge.svg?branch=master)
![npm version](https://img.shields.io/npm/v/@navikt/bedriftsmeny?label=current%20version)

# Virksomhetmeny (Bedriftsmeny)

Virksomhetsvelger og -meny for innlogget arbeidsgiver.

Begrepet «virksomhet» er ønsket terminologi og det som vises i nettleseren, men
du vil se at npm-pakken, koden og lignende bruker begrepet «bedrift». Det som vises i nettleseren er «virksomhet» og
det er ikke prioritert å endre pakkenavn og lignende.

## Bruk

### Installer komponenten

```sh
npm install @navikt/bedriftsmeny
```

### Importer komponenten og CSS

```js
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '../node_modules/@navikt/bedriftsmeny/lib/bedriftsmeny.css';
```

Du er selv ansvarlig for å importere `@navikt/ds-css` i din egen app. Bedriftsmenyen antar at CSS-klasser og Less-variabler fra denne pakken er tilgjengelige.

### Render komponenten øverst i applikasjonen

```jsx
<div>
    <Bedriftsmeny />
    /* Resten av applikasjonen */
</div>
```

NB! Hvis du f.eks kjører på Next.js og er avhengig av å styre hvordan query-parameterne settes så kan du implementere din egen `orgnrSearchParam` hook. Dette gjør at man slipper en avhengighet til `react-router-dom` 

Eksempel:
````typescript jsx
export default function() {
    const { query, push } = useRouter()
    const useOrgnrHook: () => [string | null, (orgnr: string) => void] =
        useCallback(() => {
            const currentOrgnr =
                typeof query.bedrift === "string" ? query.bedrift : null;

            return [
                currentOrgnr,
                (orgnr: string) => {
                    if (currentOrgnr !== orgnr) {
                        if (orgnr === null) {
                            push("");
                        } else {
                            push(`?bedrift=${orgnr}`);
                        }
                    }
                },
            ];
        }, [push, query.bedrift]);

    return (
        <Bedriftsmeny
            orgnrSearchParam={useOrgnrHook}
            sidetittel={"Tittel"}
            organisasjoner={[
                {
                    Name: "Forelder",
                    Type: "Enterprise",
                    OrganizationNumber: "811076112",
                    ParentOrganizationNumber: "",
                    OrganizationForm: "FLI",
                    Status: "Active",
                },
                {
                    Name: "BALLSTAD OG HAMARØY",
                    Type: "Business",
                    OrganizationNumber: "811076732",
                    ParentOrganizationNumber: "811076112",
                    OrganizationForm: "BEDR",
                    Status: "Active",
                },
                {
                    Name: "Tvedestrand",
                    Type: "Business",
                    OrganizationNumber: "811076733",
                    ParentOrganizationNumber: "811076112",
                    OrganizationForm: "BEDR",
                    Status: "Active",
                },
            ]}
        />
    );
}

````

## Utvikling

```sh
npm install
npm run dev
```

## Publisering på NPM


Oppgrader versjonsnummer i package.json ved å kjøre `npm version patch/minor/major` (F.eks 
"npm version major" hvis det er breaking changes). Hvis du er i tvil om du skal oppgradere med patch, minor eller
major, kan lese om sematic versioning på https://semver.org/. Ved å kjøre en av de tre kommandoene opprettes det en ny
commit med det nye versjonsnummeret som commit message.
Det opprettes samtidig en ny tag med det nye versjonsnummeret.

Commits til master med ny versjon i `package.json` vil publiseres til NPM.

## Kontakt oss
Opprett issue i repository hvis du lurer på noe.

De med tilgang til NAVs interne slack anbefales å bruker `#bedriftsmeny`.

Opprinnelig laget av TAG (Tjenester for arbeidsgivere).
