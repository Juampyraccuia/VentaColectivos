import { useEffect, useState } from "react";
import axios from "axios";

export const AsientosPage = () => {
  const [asientos, setAsientos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAsientos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/asientos"); 
        setAsientos(response.data);
        setError(null);
      } catch (error) {
        console.error("Error al obtener los asientos:", error);
        setError("Error al obtener los asientos. Inténtalo de nuevo más tarde.");
      }
    };

    obtenerAsientos();
  }, []);

  return (
    <>
      <h2>Asientos Disponibles</h2>
      {error && <p>{error}</p>}
      <div className="fila-asientos">
        {asientos.map((asiento) => (
          <div
            key={asiento.id}
            className={`asiento ${asiento.estado === "ocupado" ? "ocupado" : "libre"}`}
          >
            {asiento.numero}
          </div>
        ))}
      </div>
    </>
  );
};

export default AsientosPage;
