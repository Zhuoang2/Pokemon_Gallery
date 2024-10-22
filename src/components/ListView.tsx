import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
  id: number;
}

const ListView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortProperty, setSortProperty] = useState<'name' | 'id'>('name');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=1000'
        );
        const resultsWithId = response.data.results.map((pokemon: any) => {
          const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
          return { ...pokemon, id };
        });
        setPokemonList(resultsWithId);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortProperty === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortProperty === 'id') {
        comparison = a.id - b.id;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredPokemon(filtered);
  }, [searchQuery, sortOrder, sortProperty, pokemonList]);

  return (
    <div className="container">
      <h1>Pokémon List View</h1>
        <div className="gallery-link">
          <Link to="/gallery">
            Go to Gallery View
          </Link>
        </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex align-center">
          <label htmlFor="sortProperty">
            Sort By:
          </label>
          <select
            id="sortProperty"
            value={sortProperty}
            onChange={(e) => setSortProperty(e.target.value as 'name' | 'id')}
          >
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>

          <label htmlFor="sortOrder">
            Order:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <p>
        Showing {filteredPokemon.length} out of {pokemonList.length} Pokémon
      </p>
      <ul className="pokemon-list">
        {filteredPokemon.map((pokemon) => (
          <li key={pokemon.name} className="list-item">
            <Link to={`/pokemon/${pokemon.name}`}>
              {pokemon.id} -{' '}
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
