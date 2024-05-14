import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../componentes/Context';
import { supabase } from '../Supabase/Supabase';
import Header from '../componentes/Header';

function Login() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth(); // Obtén la función login y setUser del contexto AuthContext

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el correo electrónico y la contraseña no están vacíos
    if (!correo || !contraseña) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    // Verificar si la contraseña tiene al menos 6 caracteres
    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      let { user, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contraseña,
      });

      if (error) {
        setError('Credenciales de inicio de sesión incorrectas.');
        return;
      }

      login(user); // Pasar el usuario al contexto AuthContext
      setUser(user); // Actualizar el usuario en el estado local también
      console.log('Usuario después de iniciar sesión:', correo); // Imprimir el usuario después de iniciar sesión
      navigate('/pokemon', { state: { correo: correo }});

    } catch (error) {
      console.error('Error general:', error.message);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <>
      <div>
        <Header />
        <div className="container mx-auto">
          <div className="container">
            <h1 className="mt-5 text-center">Inicia sesión</h1>
            <div className="m-5 mx-auto" style={{ maxWidth: '400px' }}>
              <form className="border shadow-sm p-3 rounded-md bg-white" onSubmit={handleSubmit}>
                {error && <p className="text-red-500">{error}</p>}
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  required
                  id="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mt-3">
                  Contraseña:
                </label>
                <input
                  required
                  minLength="6"
                  id="pass"
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  onChange={(e) => setContraseña(e.target.value)}
                />
                <div className="flex items-center mt-3">
                  <input
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    type="checkbox"
                    id="flexCheckChecked"
                    defaultChecked
                  />
                  <label className="ml-2 block text-sm text-gray-900" htmlFor="flexCheckChecked">
                    Recordar sesión
                  </label>
                </div>
                <a className="block text-sm text-right text-blue-600 mt-2" href="#">
                  ¿Has olvidado tu contraseña?
                </a>
                <button type="submit" className="shadow bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md w-full py-2 mt-3 block text-center">
                  Iniciar sesión
                </button>
              </form>
              <Link to="/registro" className="block mt-5 shadow bg-gradient-to-r from-gray-400 to-gray-700 text-white rounded-md py-2 text-center">
                ¿Eres nuevo? Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>    
    </>
  );
}

export default Login;
