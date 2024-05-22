/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Tarjeta from './Tarjeta';
import {  useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Context';
import { supabase } from '../Supabase/Supabase';
import Clicks from "../componentes/Clicks";


export default function GrupoTarjeta({ tarjetas }) {
    const [giro1, setGiro1] = useState(null);
    const [estanGiradas, setestanGiradas] = useState([]);
    const [idCoincidentes, setIdCoincidentes] = useState([]);
    const [tiempoRestante, setTiempoRestante] = useState(20); // Tiempo inicial
    const [puntuacion, setPuntuacion] = useState(0);
    const [bloquearClick, setBloquearClick] = useState(false); // Variable para bloquear clics
    const [todasCartasAcertadas, setTodasCartasAcertadas] = useState(false);
    const { logged, user } = useAuth(); // Obtén el estado logged y la información del usuario del contexto de autenticación

    const { state } = useLocation();
    const correo = state?.correo;
    const navigate = useNavigate();

    // Contador de tiempo
    useEffect(() => {
        // Decrementar el tiempo restante cada segundo
        const interval = setInterval(() => {
            setTiempoRestante(prevTiempo => prevTiempo - 1);
        }, 1000);

        // Detener el contador cuando el tiempo llegue a cero
        if (tiempoRestante === 0 || todasCartasAcertadas) {
            alert('Se acabó el tiempo')
            clearInterval(interval);
            if (puntuacion > 0 && logged == true) {
                guardarPartida();
                
            }
        }

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, [tiempoRestante, todasCartasAcertadas]);

    const handleCardClick = (id, estado) => {
        if (bloquearClick || estado) return; // Bloquear clics si está activado el bloqueo o si la carta ya está girada

        if (giro1 === null) {
            const primero = tarjetas.find(tarjeta => tarjeta.id === id);
            primero.estado = true;
            setGiro1(id);
        } else {
            const segundo = tarjetas.find(tarjeta => tarjeta.id === id);
            segundo.estado = true;
            setestanGiradas([...estanGiradas, giro1, id]);

            verificarCarta(giro1, id);
            setGiro1(null);
            setBloquearClick(true); // Bloquear clics después de girar dos cartas
        }
    };

    const verificarCarta = (giro1, Giro2) => {
        const primero = tarjetas.find(tarjeta => tarjeta.id === giro1);
        const segundo = tarjetas.find(tarjeta => tarjeta.id === Giro2);

        if (primero.idPokemon === segundo.idPokemon) {
            setIdCoincidentes([...idCoincidentes, giro1, Giro2]);
            // Incrementar la puntuación
            setPuntuacion(prevPuntuacion => prevPuntuacion + 1);
            setTimeout(() => {
                setBloquearClick(false); 
            }, 500); 
            if (idCoincidentes.length + 2 === tarjetas.length) {
                setTodasCartasAcertadas(true);
            }
        } else {
            setTimeout(() => {
                primero.estado = false;
                segundo.estado = false;
                // Actualizar el estado de las tarjetas para que se muestren como giradas
                setestanGiradas([]);
                setBloquearClick(false); // Desbloquear clics si las cartas no coinciden
            }, 1000); // Girar las tarjetas no coincidentes después de 1 segundo
        }
    };

    const guardarPartida = async () => {
        try {
            if (!logged || !correo) { // Cambiado de 'user' a 'correo'
                console.error("Usuario no autenticado");
                return;
            }
    
            const { data: partida, error } = await supabase.from('partidas').insert([
                { 
                    nombre: correo, 
                    fecha: new Date().toISOString().split('T')[0], 
                    hora: new Date().toLocaleTimeString([], {hour12: false}), 
                    puntos: puntuacion 
                }
            ]);
    
            if (error) {
                throw error;
            }
    
            console.log('Partida guardada exitosamente:', partida);
            setTimeout(() => {
                navigate('/ranking'); 
            }, 1000);
        } catch (error) {
            console.error('Error al guardar la partida:', error.message);
        }
    };

    return (
        <div>
           <div className='flex pl-4'>
            <Clicks />
           <div className='flex pt-3'>
           <div >Puntuación: {puntuacion}</div>
            <div className='pl-3'>Tiempo restante: {tiempoRestante}</div>
           </div>
           </div>
            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-5">
                {tarjetas.map((tarjeta, index) => (
                    <Tarjeta
                        key={index}
                        id={tarjeta.id}
                        idPokemon={tarjeta.idPokemon}
                        nombre={tarjeta.nombre}
                        imagen={tarjeta.imagen}
                        estado={tarjeta.estado}
                        pareja={idCoincidentes.includes(tarjeta.id)}
                        onCardClick={() => handleCardClick(tarjeta.id, tarjeta.estado)}
                    />
                ))}
            </div>
        </div>
    );
}
