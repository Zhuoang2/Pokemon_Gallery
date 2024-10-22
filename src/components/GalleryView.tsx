import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface TypeInfo {
  type: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  id: number;
  types: TypeInfo[];
  sprite: string;
}

const GalleryView: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/type');
        setTypes(response.data.results.map((type: any) => type.name));
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    const fetchInitialPokemon = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=100'
        );
        const promises = response.data.results.map(async (pokemon: any) => {
          const pokemonData = await axios.get(pokemon.url);
          return {
            name: pokemonData.data.name,
            id: pokemonData.data.id,
            types: pokemonData.data.types as TypeInfo[],
            sprite: pokemonData.data.sprites.front_default,
          };
        });
        const results = await Promise.all(promises);
        setPokemonList(results);
        // Removed setting filteredPokemon here
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
      setIsLoading(false);
    };

    const fetchRemainingPokemon = async () => {
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=900&offset=100'
        );
        const batchSize = 50;
        const totalBatches = Math.ceil(response.data.results.length / batchSize);

        for (let i = 0; i < totalBatches; i++) {
          const batchResults = response.data.results.slice(
            i * batchSize,
            (i + 1) * batchSize
          );
          const promises = batchResults.map(async (pokemon: any) => {
            const pokemonData = await axios.get(pokemon.url);
            return {
              name: pokemonData.data.name,
              id: pokemonData.data.id,
              types: pokemonData.data.types as TypeInfo[],
              sprite: pokemonData.data.sprites.front_default,
            };
          });
          const batchPokemons = await Promise.all(promises);
          setPokemonList((prevList) => [...prevList, ...batchPokemons]);
          // Removed filtering logic here
        }
      } catch (error) {
        console.error('Error fetching remaining Pokémon:', error);
      }
    };

    fetchTypes();
    fetchInitialPokemon().then(() => {
      fetchRemainingPokemon();
    });
  }, []); // Empty dependency array remains

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter((pokemon) => {
        const pokemonTypeNames = pokemon.types.map(
          (typeInfo: TypeInfo) => typeInfo.type.name
        );
        return selectedTypes.every((selectedType) =>
          pokemonTypeNames.includes(selectedType)
        );
      });
      setFilteredPokemon(filtered);
    }
  }, [selectedTypes, pokemonList]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <div className="container">
      <h1>Pokémon Gallery View</h1>
      <div className="margin-vertical">
        <Link to="/" className="link">
          Go to List View
        </Link>
      </div>
      <div className="margin-bottom">
        <div className="flex flex-wrap">
          {types.map((type) => (
            <label
              key={type}
              className={`label-base ${
                selectedTypes.includes(type)
                  ? 'label-selected'
                  : 'label-unselected'
              }`}
            >
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="hidden"
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="gallery-item">
            <Link to={`/pokemon/${pokemon.name}`}>
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="pokemon-img"
              />
              <p className="pokemon-name">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </p>
            </Link>
          </div>
        ))}
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default GalleryView;