import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())
app.set('views', './views')
app.set('view engine', 'liquid') // Vertel Express dat .liquid de standaard extensie is

// De basis URL van de PokeAPI
const pokeApi = 'https://pokeapi.co/api/v2'


// Homepage route 
app.get('/', async (req, res) => {

    try {
 
    // Stap 1: Haal een lijst van 20 Pokémon op van de PokeAPI
    const listResponse = await fetch(`${pokeApi}/pokemon?limit=20`)
    const listData = await listResponse.json()

    // Stap 2: Voor elke Pokémon halen we de detailpagina op
    const pokemonList = await Promise.all(
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