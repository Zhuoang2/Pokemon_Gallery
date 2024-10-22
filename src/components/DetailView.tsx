import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface PokemonDetail {
  name: string;
  id: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

const DetailView: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon detail:', error);
      }
    };
    fetchPokemonDetail();
  }, [name]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (pokemon) {
      let newId =
        direction === 'prev' ? pokemon.id - 1 : pokemon.id + 1;
      if (newId < 1) newId = 1000;
      if (newId > 1000) newId = 1;
      navigate(`/pokemon/${newId}`);
    }
  };

  if (!pokemon) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pokemon-header">
        <h1>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h1>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon-image"
        />
        <p>ID: {pokemon.id}</p>
      </div>
      <div className="pokemon-types">
        <h2>Types</h2>
        <div className="flex">
          {pokemon.types.map((typeInfo) => (
            <span key={typeInfo.type.name} className="type-badge">
              {typeInfo.type.name.charAt(0).toUpperCase() +
                typeInfo.type.name.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <div className="pokemon-stats">
        <h2>Stats</h2>
        <ul className="stats-list">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name} className="stat-item">
              {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:{' '}
              {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation('prev')}>Previous</button>
        <button onClick={() => handleNavigation('next')}>Next</button>
      </div>
      <div className="navigation-links">
        <Link to="/">Go to List View</Link>
        &nbsp;&nbsp;
        <Link to="/gallery">Go to Gallery View</Link>
      </div>
    </div>
  );
};

export default DetailView;