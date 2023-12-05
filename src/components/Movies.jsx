// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const API_KEY = '221532ff5ea215e47fc4685c7a8887c1';
const API_URL = 'https://api.themoviedb.org/3';

const Movies = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (query.trim() === '') {
          // Si la consulta está vacía, obtener películas populares
          axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}`)
            .then(response => {
              setPeliculas(response.data.results);
            })
            .catch(error => {
              console.error('Error al obtener películas:', error);
            });
        } else {
          // Si hay una consulta, buscar películas con esa consulta
          axios.get(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
            .then(response => {
              setPeliculas(response.data.results);
            })
            .catch(error => {
              console.error('Error al buscar películas:', error);
            });
        }
      }, [query]);

      useEffect(() => {
        const checkSession = async () => {
          const user = supabase.auth.getUser();
      
          if (user) {
            console.log('Usuario autenticado:', user);
            // Puedes realizar acciones adicionales aquí si el usuario está autenticado
          } else {
            console.log('No hay usuario autenticado.');
          }
        };
      
        checkSession();
      }, []); // El segundo parámetro, [], asegura que este efecto se ejecute solo al montar el componente
      
    
      const handleInputChange = (e) => {
        setQuery(e.target.value);
      };
    
      const handleSearch = (e) => {
        e.preventDefault();
        // Navegar a la ruta de búsqueda con la consulta actual
        navigate(`/search?q=${query}`);
      };
    
      return (
        <div className="container mx-auto my-8">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={query}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </form>
          <h1 className="text-3xl font-bold mb-4">Películas Populares</h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {peliculas.map(movie => (
              <li key={movie.id} className="bg-white p-4 rounded shadow">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto object-cover mb-4 rounded cursor-pointer"
                  />
                </Link>
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p className="text-gray-600">{movie.release_date}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    };
    
    export default Movies;
