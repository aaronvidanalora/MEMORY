/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase';
import Header from '../componentes/Header';

function Registro() {
  const navigate = useNavigate();
    
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
     
      console.log('Nombre:', nombre);
      console.log('Correo:', correo);
      console.log('Contraseña:', contraseña);

      let { data, error } = await supabase.auth.signUp({
        email: correo,
        password: contraseña
      })
      
      if (error) {
        console.error('Error al registrar usuario:', error.message);
        return;
      }

      const { data: usuariosDB, error: dbError } = await supabase
        .from('usuarios')
        .insert([
          {
            nombre: nombre, 
            email: correo, 
            user_id: data.user.id
          },
        ]);
      
      if (dbError) {
        console.error('Error al insertar usuario en la base de datos:', dbError.message);
        return;
      }
                      
      navigate('/')
    } catch (error) {
      console.error('Error general:', error.message);
    }
  };

  return (
    <>
      <div>
        <Header />
      <div className="container mx-auto">
        <h1 className="mt-2 mt-lg-5 text-center">Registro</h1>
        <div className="m-5 mx-auto" style={{ maxWidth: '400px' }}>
          <form className="border shadow-sm p-3 rounded-md bg-white">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input 
              required 
              id="nombre" 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
              onChange={(e) => setNombre(e.target.value)} 
            />

            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-3">Email:</label>
            <input 
              required 
              id="email" 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
              onChange={(e) => setCorreo(e.target.value)} 
            />

            <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mt-3">Contraseña:</label>
            <input 
              required 
              minLength="6" 
              id="pass" 
              type="password" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
              onChange={(e) => setContraseña(e.target.value)} 
            />

            <button 
              type="button" 
              className="shadow bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md w-full py-2 mt-3" 
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default Registro;
