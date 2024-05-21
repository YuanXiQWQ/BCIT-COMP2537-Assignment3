import express from 'express';
import axios from 'axios';

const router = express.Router();

const API_URL = 'https://pokeapi.co/api/v2';
const POKEMONS_PER_PAGE = 20;

let allPokemonList = [];
let allTypes = [];

const loadAllData = async () => {
    try {
        const typeResponse = await axios.get(`${API_URL}/type`);
        allTypes = typeResponse.data.results;

        const pokemonResponse = await axios.get(`${API_URL}/pokemon?limit=810`);
        allPokemonList = pokemonResponse.data.results;
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
};

loadAllData()
    .catch(err => console.error('Error loading initial data:', err));

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const selectedTypes = Array.isArray(req.query.type) ? req.query.type : req.query.type ? [req.query.type] : [];

    try {
        let filteredPokemonList = allPokemonList;

        if (selectedTypes.length > 0) {
            const filteredPokemons = [];
            for (const type of selectedTypes) {
                const typeDetails = await axios.get(`${API_URL}/type/${type}`);
                const pokemonsOfType = typeDetails.data.pokemon.map(p => p.pokemon.name);
                filteredPokemons.push(...pokemonsOfType);
            }
            filteredPokemonList = filteredPokemonList.filter(pokemon => filteredPokemons.includes(pokemon.name));
        }

        const totalPokemons = filteredPokemonList.length;

        const paginatedPokemonList = filteredPokemonList.slice((page - 1) * POKEMONS_PER_PAGE, page * POKEMONS_PER_PAGE);

        const detailedPokemonList = await Promise.all(paginatedPokemonList.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
                name: pokemon.name,
                image: details.data.sprites.front_default,
            };
        }));

        res.render('index', {
            pokemonList: detailedPokemonList,
            total: totalPokemons,
            currentPage: page,
            totalPages: Math.ceil(totalPokemons / POKEMONS_PER_PAGE),
            types: allTypes,
            selectedTypes: selectedTypes
        });
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        res.status(500).send('Error fetching Pokémon data');
    }
});

export default router;
