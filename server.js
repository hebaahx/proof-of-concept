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
        pokemonByType.map(async (item) => {

          const detailResponse = await fetch(item.pokemon.url)
          const detailData = await detailResponse.json()

          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other['official-artwork'].front_default
              ?? detailData.sprites.front_default,
            types: detailData.types.map((type) => type.type.name),
          }
        })
      )

    } else if (query) {

      // Zoek de pokémon op via NAAM in de PokeAPI
      const searchResponse = await fetch(`${pokeApi}/pokemon/${query}`)

      // Als de pokémon niet bestaat geeft de API een 404 terug
      if (!searchResponse.ok) {
        return res.render('index', {
          pokemonList: [],
          error: `No Pokémon found with the name "${query}"`
        })
      }

      const detailData = await searchResponse.json()

      // Maak er één kaartje van, die lijkt op homepage
      pokemonList = [{
        id: detailData.id,
        name: detailData.name,
        image: detailData.sprites.other['official-artwork'].front_default ?? detailData.sprites.front_default,
        types: detailData.types.map((type) => type.type.name),
      }]

    } else {


      // Stap 1: Haal een lijst van 20 Pokémon op van de PokeAPI
      const listResponse = await fetch(`${pokeApi}/pokemon?limit=${limit}`)
      const listData = await listResponse.json()

      // Stap 2: Voor elke Pokémon halen we de detailpagina op
      pokemonList = await Promise.all(
        listData.results.map(async (pokemon) => {

          const detailResponse = await fetch(pokemon.url)
          const detailData = await detailResponse.json()


          // Stap 3: Geef alleen de velden terug die we nodig hebben op de homepage
          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other['official-artwork'].front_default
              ?? detailData.sprites.front_default,
            types: detailData.types.map((type) => type.type.name),
          }
        })
      )
    }

    // Stap 4: Render de homepage template en geef de pokémon data mee
    res.render('index', { pokemonList })

  } catch (error) {
    console.error(error)
    res.status(500).send('something went wrong')
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