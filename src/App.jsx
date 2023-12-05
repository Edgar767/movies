// eslint-disable-next-line no-unused-vars
import React, { useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Movies from './components/Movies';
import MovieDetail from './components/MovieDetail';
import { useState } from 'react';

const App = () => {
  // Estado para rastrear la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = (userInfo) => {
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Movies /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetail user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
