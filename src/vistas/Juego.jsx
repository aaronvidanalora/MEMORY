import { useEffect, useState } from "react";
import GrupoTarjeta from "../componentes/GrupoTarjetas";
import Header from "../componentes/Header";


export default function Juego() {
    const [pokemonAleatorios, setPokemonsAleatorios] = useState([]);
    
   

    useEffect(() => {
        async function fetchData() {
            try {
                const promises = [];
                for (let i = 0; i < 9; i++) {
                    const random = Math.floor(Math.random() * 898) + 1;
                    const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch data');
                            }
                            return response.json();
                        })
                        .then(data => ({
                            idPokemon: data.id,
                            nombre: data.name,
                            imagen: data.sprites.other['official-artwork'].front_default,
                            estado: false,
                            pareja: false,
                        }));
                    promises.push(promise);
                }
                
                const pokemonData = await Promise.all(promises);
                const pokemonDuplicados = [...pokemonData, ...pokemonData].map((pokemon, index) => ({
                    ...pokemon,
                    id: index,
                }));

                const pokemonRandom = pokemonDuplicados.sort(() => Math.random() - 0.5);
                setPokemonsAleatorios(pokemonRandom);
            } catch (error) {
                console.error(error.message);
            } finally {
                console.log('Petición finalizada');
            }        
        }
        
        fetchData();
    }, []);

    
    return (
        <div>
            <Header />
            <div className="bg-blue-600">
                <div className="container mx-auto">
                   
                    <GrupoTarjeta tarjetas={pokemonAleatorios} setPokemonsAleatorios={setPokemonsAleatorios}  />
                </div>
            </div>
        </div>
    );
}
