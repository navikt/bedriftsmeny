# Bedriftsmeny

Bedriftsvelger og -meny for innlogget arbeidsgiver.
Laget av TAG (Tjenester for arbeidsgivere).

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

Du er selv ansvarlig for å importere `nav-frontend-core` i din egen app. Bedriftsmenyen antar at CSS-klasser og Less-variabler fra denne pakken er tilgjengelige.

### Render komponenten øverst i applikasjonen

```jsx
<div>
    <Bedriftsmeny />
    /* Resten av applikasjonen */
</div>
```

## Utvikling

```sh
npm install
npm start
```

## Publisering på NPM

Alle commits vil bygges og testes på CircleCI. Commits som er tagget med en ny versjon ("vX.Y.Z") vil publiseres til NPM, men disse krever en manuell godkjenning i CircleCI først. Oppskriften på å publisere ny versjon blir dermed:

1. Først merger du inn endringene dine i master.
3. Oppgrader versjonsnummer i package.json ved å kjøre `npm version patch/minor/major` (F.eks "npm version major" hvis det er breaking changes). Hvis du er i tvil om du skal oppgradere med patch, minor eller major, kan lese om sematic versioning på https://semver.org/. Ved å kjøre en av de tre kommandoene opprettes det en ny commit med det nye versjonsnummeret som commit message. Det opprettes samtidig en ny tag med det nye versjonsnummeret. For å se alle opprettede tagger kan du kjøre git tag i prosjektet.
2. Push commiten opprettet i punkt 2.
4. Derettes pusher du den nye taggen ved å kjøre git push origin vX.Y.Z., der X.Y.Z er taggen du opprettet i punkt 2 (F.eks push origin v2.0.0, dersom det er den nye taggen)._Dette trigger en publisering (med godkjenning) hos CircleCI_.
5. Hvis byggingen gikk fint (sjekk https://circleci.com/gh/navikt/workflows/bedriftsmeny) kan du godkjenne publiseringen. Da vil den nye versjonen snart ligge på NPM! https://www.npmjs.com/package/@navikt/bedriftsmeny

## Stack

### Bundling

Bedriftsmenyen bygges med Webpack og Babel. Babel klarer å tolke TypeScript med `@babel/preset-typescript` og JSX med `@babel/preset-react` (se _babel.config.js_). Less kompileres til CSS og bundles sammen med JavaScript i _lib/bedriftsmeny.css_. Babel klarer ikke å generere deklarasjonsfiler for TypeScript, så vi gjør dette i et eget steg som en del av bygget.

### Utvikling

Under utvikling (`npm start`) bygges appen med Parcel og en egen TypeScript-konfigurasjonsfil.