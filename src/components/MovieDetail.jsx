// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { supabase, } from '../utils/supabase';
import PropTypes from 'prop-types';

const API_KEY = '221532ff5ea215e47fc4685c7a8887c1';
const API_URL = 'https://api.themoviedb.org/3';

const MovieDetail = ({ user }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

//VERIFICAR SESION
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

  useEffect(() => {
    // Obtener detalles de la película
    axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error('Error al obtener detalles de la película:', error);
      });

    // Obtener reseñas de la base de datos
    supabase
      .from('reviews')
      .select('user_id, review, rating')
      .eq('movie_id', id)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener reseñas:', error.message);
        } else {
          setReviews(data);
        }
      });
  }, [id]);

  const handleAddReview = async () => {
    // Verificar si hay un usuario en sesión
    if (user && user.id) {
      // Agregar nueva reseña a la base de datos
      const { data, error } = await supabase
        .from('reviews')
        .upsert([
          {
            movie_id: id,
            user_id: user.id,
            review: newReview,
            rating: newRating,
          },
        ]);

        if (error) {
          console.error('Error al agregar reseña:', error.message);
        } else {
          // Actualizar la lista de reseñas
          setReviews([...reviews, data[0]]);
          // Limpiar los campos del formulario
          setNewReview('');
          setNewRating(0);
        }
      } else {
        // Manejar el caso en que no hay una sesión activa o el usuario no está definido
        console.log('No hay una sesión activa o el usuario no está definido.', user);
      }
    };

  // SECCION DE RESEÑAS
  const handleEditReview = async (reviewId, updatedReview, updatedRating) => {
    // Actualizar reseña en la base de datos
    const { data, error } = await supabase
      .from('reviews')
      .upsert([
        {
          id: reviewId,
          movie_id: id,
          user_id: supabase.auth.user().id,
          review: updatedReview,
          rating: updatedRating,
        },
      ]);

    if (error) {
      console.error('Error al editar reseña:', error.message);
    } else {
      // Actualizar la lista de reseñas
      setReviews(reviews.map(review => (review.id === reviewId ? data[0] : review)));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    // Eliminar reseña de la base de datos
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error al eliminar reseña:', error.message);
    } else {
      // Actualizar la lista de reseñas
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  if (!movie) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto my-8">
      {/* Detalles de la película */}
      <div className="flex flex-col lg:flex-row items-center">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full lg:w-1/3 h-auto object-cover mb-4 rounded-lg lg:mr-8"
        />
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg mb-4">{movie.overview}</p>
          <p className="text-gray-600">Fecha de lanzamiento: {movie.release_date}</p>
          <p className="text-gray-600">Calificación: {movie.vote_average}</p>
        </div>
      </div>

      {/* Sección de reseñas */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reseñas</h2>

        {/* Lista de reseñas */}
        <ul>
          {reviews.map(review => (
            <li key={review.id} className="mb-4">
              <strong>{review.user_id}</strong>: {review.review} - Rating: {review.rating}
              {/* Botones de editar y borrar */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    const updatedReview = prompt('Editar reseña:', review.review);
                    const updatedRating = Number(prompt('Editar rating:', review.rating));

                    if (updatedReview !== null && !isNaN(updatedRating)) {
                      handleEditReview(review.id, updatedReview, updatedRating);
                    }
                  }}
                  className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
                      handleDeleteReview(review.id);
                    }
                  }}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Formulario para agregar reseña */}
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Agregar Reseña</h3>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Escribe tu reseña..."
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating:
          </label>
          <input
            type="number"
            id="rating"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleAddReview}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Agregar Reseña
          </button>
        </div>
      </div>
    </div>
  );
};

// Agrega la validación de tipos de propiedades
MovieDetail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    // Agrega aquí cualquier otra propiedad que pueda tener tu objeto de usuario
  }),
};

export default MovieDetail;