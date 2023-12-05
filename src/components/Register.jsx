// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error al registrar usuario:', error.message);
        return;
      }

      console.log('Registro exitoso:', data);
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión después del registro exitoso
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Registrarse</h1>
        <form onSubmit={handleRegister}>
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
            Registrarse
          </button>
        </form>
        <div className="mt-4">
          <p className="text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
