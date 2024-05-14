import { useEffect, useState } from "react";
import { supabase } from "../Supabase/Supabase";
import Header from "../componentes/Header";

function Ranking() {
    const [partidas, setPartidas] = useState([]);

    useEffect(() => {
        async function fetchPartidas() {
            try {
                const { data, error } = await supabase.from('partidas').select('*');
                if (error) {
                    throw error;
                }
                setPartidas(data);
            } catch (error) {
                console.error('Error al obtener las partidas:', error.message);
            }
        }
        fetchPartidas();
    }, []);

    return (
        <div>
            <Header></Header>
            <h1 className="mt-2 mt-lg-5 text-center">Ranking de partidas</h1>
            <div className="m-5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {partidas.map((partida) => (
                            <tr key={partida.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{partida.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{partida.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{partida.hora}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{partida.puntos}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ranking;
