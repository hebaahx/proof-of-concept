Ontwerp en maak een data driven online concept voor een opdrachtgever

De instructies voor deze opdracht staan in: [docs/INSTRUCTIONS.md](https://github.com/fdnd-task/proof-of-concept/blob/main/docs/INSTRUCTIONS.md)

# Pokédex
Een webapplicatie waarmee je Pokémon kan bekijken, zoeken en vangen, gebouwd met Express, Liquid en de PokeAPI.

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
Deze Pokédex is een webapplicatie waarmee gebruikers door een overzicht van Pokémon kunnen bladeren, op naam of type kunnen zoeken, en gevangen Pokémon kunnen opslaan in hun eigen "Caught Pokémon" lijst. De data komt live van de officiële PokeAPI, en de gevangen Pokémon worden opgeslagen via een Directus database.
<img width="249" height="374" alt="image" src="https://github.com/user-attachments/assets/2db2128a-717e-4807-954c-c6362f9fdcb3" />

Dit is een live link waar je de pokedex kan bekijken:proof-of-concept-lpgf.onrender.com

## Gebruik
**User story:**
Als gebruiker wil ik een overzicht zien van alle Pokémon en kunnen zoeken op naam, zodat ik snel een specifieke Pokémon kan vinden.
**Hoe het werkt:**
Op de homepage zie je een overzicht van Pokémon met hun naam, afbeelding en type. Via de zoekbalk kan je zoeken op naam (bijv. `bulbasaur`) of op type (bijv. `fire`). Klik op een Pokémon om de detailpagina te openen, met informatie over de Pokémon (zoals gewicht, lengte en abilities), de stats, en de evolutieketen. Op de detailpagina kan je de Pokémon "vangen" door op de Pokéball knop te klikken. Gevangen Pokémon zijn terug te vinden via "Caught Pokémon" in de navigatie.

## Kenmerken

**HTML structuur:**
De pagina's zijn opgebouwd met semantische HTML: `<header>`, `<nav>`, `<main>`, `<article>` en `<section>` worden gebruikt waar relevant. Formulieren hebben gekoppelde `<label>` elementen, en de detailpagina gebruikt `aria-labelledby` om secties te koppelen aan hun kop, voor goede toegankelijkheid.

**CSS:**
De stijl is opgebouwd met CSS variabelen (`:root`) voor kleuren, zodat type-kleuren en algemene kleuren op één plek beheerd worden. CSS nesting wordt gebruikt voor leesbaarheid binnen componenten zoals `.card` en `.evolution-card`. De layout is mobile-first opgebouwd, met een `@media` query voor de desktop weergave.

**JavaScript / Node.js:**
De backend is gebouwd met Express.js en gebruikt de Liquid template engine om server-side HTML te renderen. Data wordt opgehaald van de PokeAPI met `fetch` en `async/await`, waarbij `Promise.all()` gebruikt wordt om meerdere Pokémon-detailverzoeken parallel te versturen in plaats van na elkaar. Het project gebruikt herbruikbare functies (zoals `getPokemonDetails` en `getUserCatches`) om herhaalde code te voorkomen (DRY).

**Database:**
Gevangen Pokémon worden opgeslagen via de Directus API. Een POST-verzoek slaat een nieuwe catch op, en een DELETE-verzoek verwijdert een catch weer.

## Installatie
1. Clone deze repository - https://github.com/hebaahx/proof-of-concept
2. Installeer de dependencies - npm install
3. Start de server 
4. Open de applicatie in je browser op: 

## Bronnen
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
