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
    const [primerClick, setPrimerClick] = useState(null);
    const [tarjetasGiradas, setTarjetasGiradas] = useState([]);
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

        if (primerClick === null) {
            const primeraCarta = tarjetas.find(tarjeta => tarjeta.id === id);
            primeraCarta.estado = true;
            setPrimerClick(id);
        } else {
            const segundaCarta = tarjetas.find(tarjeta => tarjeta.id === id);
            segundaCarta.estado = true;
            setTarjetasGiradas([...tarjetasGiradas, primerClick, id]);

            compararCartas(primerClick, id);
            setPrimerClick(null);
            setBloquearClick(true); // Bloquear clics después de girar dos cartas
        }
    };

    const compararCartas = (primerClick, segundoClick) => {
        const primeraCarta = tarjetas.find(tarjeta => tarjeta.id === primerClick);
        const segundaCarta = tarjetas.find(tarjeta => tarjeta.id === segundoClick);

        if (primeraCarta.idPokemon === segundaCarta.idPokemon) {
            setIdCoincidentes([...idCoincidentes, primerClick, segundoClick]);
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
                primeraCarta.estado = false;
                segundaCarta.estado = false;
                // Actualizar el estado de las tarjetas para que se muestren como giradas
                setTarjetasGiradas([]);
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
                    nombre: correo, // Cambiado de 'user.email' a 'correo'
                    fecha: new Date().toISOString().split('T')[0], // Formato de fecha: 'YYYY-MM-DD'
                    hora: new Date().toLocaleTimeString([], {hour12: false}), // Formato de hora: 'HH:MM:SS'
                    puntos: puntuacion // Puntos obtenidos en el juego
                }
            ]);
    
            if (error) {
                throw error;
            }
    
            console.log('Partida guardada exitosamente:', partida);
            setTimeout(() => {
                navigate('/ranking'); // Redirige a /ranking después de 1 segundo
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
