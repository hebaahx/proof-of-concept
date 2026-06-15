import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())
app.set('views', './views')
app.set('view engine', 'liquid') // Vertel Express dat .liquid de standaard extensie is

// De basis URL van de PokeAPI
const pokeApi = 'https://pokeapi.co/api/v2'
const limit = 20

// ------------Functie voor basis info op hompage ---------------
async function getPokemonDetails(url) {
  const detailResponse = await fetch(url)


  if (!detailResponse.ok) {
    throw new Error('Pokemon not found')
  }

  const detailData = await detailResponse.json()

  return {
    id: detailData.id,
    name: detailData.name,
    // official-artwork geeft het mooie plaatje, front_default is de fallback
    image: detailData.sprites.other['official-artwork'].front_default
      ?? detailData.sprites.front_default,
    // map geeft alleen de namen terug bijv. ['grass', 'poison']  
    types: detailData.types.map((type) => type.type.name),
  }
}

// ── Functie voor volledige pokemon info (gebruikt op detailpagina) ──
async function getPokemonFullDetails(id) {
  const pokemonResponse = await fetch(`${pokeApi}/pokemon/${id}`)
  const pokemonData = await pokemonResponse.json()

  // Haal species op voor evolutieketen
  const speciesResponse = await fetch(pokemonData.species.url)
  const speciesData = await speciesResponse.json()

  // Haal evolutieketen op
  const evolutionResponse = await fetch(speciesData.evolution_chain.url)
  const evolutionData = await evolutionResponse.json()

  // Zet evolutieketen om naar simpele array
  const evolutions = []
  let evolutionChain = evolutionData.chain

  while (evolutionChain) {
    // Het ID zit in de URL bijv. .../pokemon-species/1/ → we pakken '1'
    const evolutionId = evolutionChain.species.url.split('/').filter(Boolean).pop()
    evolutions.push({
      // padStart maakt van 1 → 001, van 25 → 025
      id: String(evolutionId).padStart(3, '0'),
      name: evolutionChain.species.name,
      // Vaste GitHub URL waar alle pokemon plaatjes staan
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionId}.png`
    })
    // Ga naar volgende evolutie, stop als er geen meer is
    evolutionChain = evolutionChain.evolves_to[0] || null
  }

  return {
    // padStart maakt van 1 → 001
    id: String(pokemonData.id).padStart(3, '0'),
    name: pokemonData.name,
    image: pokemonData.sprites.other['official-artwork'].front_default
      ?? pokemonData.sprites.front_default,
    types: pokemonData.types.map((type) => type.type.name),
    // API geeft hectogram → delen door 10 = kilogram
    weight: (pokemonData.weight / 10) + ' kg',
    // API geeft decimeter → maal 10 = centimeter
    height: (pokemonData.height * 10) + ' cm',
    baseXp: pokemonData.base_experience,
    // join zet array om naar string: ['overgrow', 'chlorophyll'] → 'overgrow, chlorophyll'
    abilities: pokemonData.abilities.map((ability) => ability.ability.name).join(', '),
    stats: pokemonData.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat
    })),
    evolutions: evolutions
  }
}

// ------------Homepage route en zoeken ---------------
app.get('/', async (req, res) => {

  try {

    const query = req.query.search?.toLowerCase().trim()

    // Lijst van alle bekende types
    const allTypes = ['fire', 'water', 'grass', 'electric', 'psychic',
      'normal', 'fighting', 'poison', 'ghost', 'dragon',
      'bug', 'flying', 'rock', 'ice', 'steel',
      'ground', 'dark', 'fairy']
    let pokemonList = []

    if (allTypes.includes(query)) {

      // Zoeken op type pokemon
      const typeResponse = await fetch(`${pokeApi}/type/${query}`)
      const typeData = await typeResponse.json()

      const pokemonByType = typeData.pokemon.slice(0, limit)

      pokemonList = await Promise.all(
        pokemonByType.map((item) => getPokemonDetails(item.pokemon.url))
      )


    } else if (query) {

      try {

        const pokemon = await getPokemonDetails(
          `${pokeApi}/pokemon/${query}`
        )

        pokemonList = [pokemon]

      } catch {

        return res.render('index', {
          pokemonList: [],
          error: `No Pokémon found with the name "${query}"`
        })

      }

    } else {


      const listResponse = await fetch(`${pokeApi}/pokemon?limit=${limit}`)
      const listData = await listResponse.json()

      pokemonList = await Promise.all(
        listData.results.map((pokemon) => getPokemonDetails(pokemon.url))
      )
    }

    res.render('index', { pokemonList })

  } catch (error) {
    console.error(error)
    res.status(500).send('something went wrong')
  }
})

// ── Detailpagina ──
app.get('/pokemon/:id', async (req, res) => {
  try {

    // Haal alle details van de pokemon op
    const pokemon = await getPokemonFullDetails(req.params.id)


    res.render('detail', { pokemon })

  } catch (error) {
    console.error(error)
    res.status(404).render('404')
  }
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Application started on http://localhost:${app.get('port')}`)
})