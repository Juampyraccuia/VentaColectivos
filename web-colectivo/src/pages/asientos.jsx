import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import axios from "axios";

export const AsientosPage = () => {
  const { sesion } = useAuthContext();
  const [asientos, setAsientos] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios
      .get(`http://localhost:3000/boletos/${sesion.user}asientos`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => {
        setAsientos(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al obtener los asientos:", error);
        setError("Error al obtener los asientos. Inténtalo de nuevo más tarde.");
      });
  }, [sesion, setAsientos]);

  return (
    <>
      <h2>Asientos</h2>
      {error && <p>{error}</p>}
      <div className="fila-asientos">
        {asientos.map((asiento) => (
          <div key={asiento.id} className={`asiento ${asiento.estado === "ocupado" ? "ocupado" : "disponible"}`}>
            {asiento.numero}
          </div>
        ))}
      </div>
    </>
  );
};
