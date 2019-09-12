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

1. Commit endringene dine som vanlig.
3. Oppgrader versjonsnummer i package.json med `npm version patch/minor/major`. (se https://docs.npmjs.com/cli/version). Dette oppretter en ny commit med det nye versjonsnummeret som commit message, og oppretter samtidig en tilhørende tag.
2. Push de to siste commitene du nettopp opprettet.
4. Push den nye taggen (typ `git push vX.Y.Z`. Se `git tag` for liste over alle tagsene dine). _Dette trigger en publisering (med godkjenning) hos CircleCI_.
5. Hvis byggingen gikk fint (sjekk https://circleci.com/gh/navikt/workflows/bedriftsmeny) kan du godkjenne publiseringen. Da vil den nye versjonen snart ligge på NPM!

## Stack

### Bundling

Bedriftsmenyen bygges med Webpack og Babel. Babel klarer å tolke TypeScript med `@babel/preset-typescript` og JSX med `@babel/preset-react` (se _babel.config.js_). Less kompileres til CSS og bundles sammen med JavaScript i _lib/bedriftsmeny.css_. Babel klarer ikke å generere deklarasjonsfiler for TypeScript, så vi gjør dette i et eget steg som en del av bygget.

### Utvikling

Under utvikling (`npm start`) bygges appen med Parcel og en egen TypeScript-konfigurasjonsfil.