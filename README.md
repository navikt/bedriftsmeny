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

## Stack

### Bundling

Bedriftsmenyen bygges med Webpack og Babel. Babel klarer å tolke TypeScript med `@babel/preset-typescript` og JSX med `@babel/preset-react` (se _babel.config.js_). Less kompileres til CSS og bundles sammen med JavaScript i _lib/bedriftsmeny.css_. Babel klarer ikke å generere deklarasjonsfiler for TypeScript, så vi gjør dette i et eget steg som en del av bygget.

### Utvikling

Under utvikling (`npm start`) bygges appen med Parcel og en egen TypeScript-konfigurasjonsfil.