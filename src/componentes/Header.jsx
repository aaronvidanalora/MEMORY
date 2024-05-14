import { Link } from "react-router-dom";
import { useAuth } from "./Context";

export default function Header() {
  const { logged, user, logout } = useAuth(); // Obtén el estado logged, la información del usuario y la función logout del contexto de autenticación
  const handleLogout = () => {
    // Llama a la función logout al hacer clic en el botón de cerrar sesión
    logout();
  };

  return (
    <div className="text-center bg-indigo-600 py-4">
      <div className="flex flex-col items-center">
        <div className="">
          <nav>
            <ul className="flex space-x-4 text-white">
              {logged && (
                <>
                  <li className="border border-white px-4 py-2 rounded">
                    <Link to="/pokemon">POKEMON</Link>
                  </li>
                  
                  <li className="border border-white px-4 py-2 rounded">
                    <Link to="/ranking">Ranking</Link>
                  </li>
                </>
              )}
             <li className="border border-white px-4 py-2 rounded">
                    <Link to="/registro">Registro</Link>
                  </li>
             
              {logged ? (
                <>
                  <li className="border border-white px-4 py-2 rounded">
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </li>
                  {user && user.email && (
                    <li className="border border-white px-4 py-2 rounded">
                      {user.email}
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li className="border border-white px-4 py-2 rounded">
                    <Link to="/">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white pt-2">MEMORY</h1>
        </div>
      </div>
    </div>
  );
}
