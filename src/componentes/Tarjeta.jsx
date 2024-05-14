/* eslint-disable react/prop-types */
import { useState } from "react";

const imagenParteTrasera = "https://images.wikidexcdn.net/mwuploads/wikidex/thumb/9/94/latest/20230212115022/Parte_trasera_carta_de_Pok%C3%A9mon.png/180px-Parte_trasera_carta_de_Pok%C3%A9mon.png";

export default function Tarjeta({ id, nombre, imagen, estado, onCardClick }) {
  const [clicks, setClicks] = useState(0);

  return (
      <div className={`max-w-xs  rounded overflow-hidden shadow-lg  ${estado ? '' : 'girando'} p-5 sm:h-64 md:h-80 lg:h-[314px]`} id={id} onClick={() => {
          if (!estado) {
            onCardClick(id); // Solo pasamos el id, no necesitamos el estado aquí
            setClicks(clicks + 1)
          }

        }}>
          {estado ? (
            <>
              
              <img className="mx-auto w-full sm:h-auto md:h-auto lg:h-48" src={imagen} alt={nombre} />
              <div className="text-center">
                  <div className="text-xl uppercase font-bold">{nombre}</div>
              </div>
            </>
          ) : (
            <img className="mx-auto w-full " src={imagenParteTrasera} alt="Parte trasera de la carta de Pokémon" />
          )}
      </div>
  );
}
