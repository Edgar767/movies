// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Restaurar la sesión al cargar el componente
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { user, session } = await supabase.auth.getSession();
        if (user && session) {
          console.log('Sesión restaurada:', user);
          onLoginSuccess(user);
          navigate('/movies', { state: { user } });
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error.message);
      }
    };
  
    restoreSession();
  }, [onLoginSuccess, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const { data, user } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      console.log('Inicio de sesión exitoso:', data);

      onLoginSuccess(user); // Guarda la información del usuario
      navigate('/movies', { state: { user } });
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-4">
          <p className="text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-500">Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;