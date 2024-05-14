import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null); // Modifica el estado del usuario para incluir el correo electrónico

  const login = (userData) => {
    setLogged(true);
    setUser(userData);
  };

  const logout = () => {
    setLogged(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ logged, user, login, logout, setUser }}> {/* Agrega setUser al valor proporcionado por el contexto */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
