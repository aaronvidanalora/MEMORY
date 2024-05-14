// App.js
import  { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Juego from "./vistas/Juego";
import MarvelMemory from "./vistas/MarvelMemory"; // Sin llaves
import About from "./vistas/About";
import Registro from "./vistas/Registro";
import { AuthProvider } from "./componentes/Context";
import Login from "./vistas/Login";
import Ranking from "./vistas/Ranking";

// Crear el contexto para el número total de clics
export const GlobalClicksContext = createContext();

export default function App() {
  // Utilizar useState para gestionar el número total de clics
  const [totalClicks, setTotalClicks] = useState(0);

  const handleGlobalClick = () => {
    // Incrementar el contador global de clics
    setTotalClicks(prevTotalClicks => prevTotalClicks + 1);
  };

  return (
    <GlobalClicksContext.Provider value={{ totalClicks, setTotalClicks }}>
      <Router>
        <div onClick={handleGlobalClick}> 
        <AuthProvider>
          <Routes> 
            <Route  path="/" element={<Login />} />
            <Route  path="/ranking" element={<Ranking />} />
            <Route path="/marvel-memory" element={<MarvelMemory />} />
            <Route path="/about" element={<About />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/pokemon" element={<Juego />} />

          </Routes>
        
        </AuthProvider>
        </div>
      </Router>
    </GlobalClicksContext.Provider>
  );
}

// Otras importaciones y código permanecen igual
