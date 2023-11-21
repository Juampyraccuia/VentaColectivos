import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Boleto = () => {
  const { sesion } = useAuthContext();
  const [nuevoBoleto, setNuevoBoleto] = useState({
    idColectivo: "",
    precio: "",
    destino: "",
  });

  const [destinos, setDestinos] = useState([]);

  useEffect(() => {
    // Obtener la lista de destinos desde el servidor
    const fetchDestinos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/destinos");
        setDestinos(response.data);
      } catch (error) {
        console.error("Error al obtener destinos:", error);
      }
    };
    fetchDestinos();
  }, []);

  const handleComprarBoleto = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/boletos",
        {
          idcolectivo: nuevoBoleto.idColectivo,
          precio: nuevoBoleto.precio,
          destino: nuevoBoleto.destino,
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      console.log("Boleto comprado:", response.data);
      // Limpiar el formulario después de comprar el boleto
      setNuevoBoleto({ idColectivo: "", precio: "", destino: "" });
    } catch (error) {
      console.error("Error al comprar boleto:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoBoleto((prevBoleto) => ({
      ...prevBoleto,
      [name]: value,
    }));
  };

  return (
    <>
      <h2>Comprar Boleto</h2>
      <label>
        ID Colectivo:
        <input
          type="text"
          name="idColectivo"
          value={nuevoBoleto.idColectivo}
          onChange={handleChange}
        />
      </label>
      <label>
        Precio:
        <input
          type="text"
          name="precio"
          value={nuevoBoleto.precio}
          onChange={handleChange}
        />
      </label>
      <label>
        Destino:
        <select
          name="destino"
          value={nuevoBoleto.destino}
          onChange={handleChange}
        >
          <option value="">Seleccionar Destino</option>
          {destinos.map((destino) => (
            <option key={destino.iddestino} value={destino.nombre}>
              {destino.nombre}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleComprarBoleto}>Comprar Boleto</button>
    </>
  );
};
