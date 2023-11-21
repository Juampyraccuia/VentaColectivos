import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import Button from 'react-bootstrap/Button';

export const Boleto = () => {
  const { sesion } = useAuthContext();
  const [nuevoBoleto, setNuevoBoleto] = useState({
    idColectivo: "",
    precio: "",
    destino: "",
  });

  const [destinos, setDestinos] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [error, setError] = useState(null);

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

  const handleComprarBoleto = async () => {
    try {
      // Realizar la compra del boleto utilizando asientosSeleccionados
      const response = await axios.post(
        "http://localhost:3000/boletos",
        {
          idcolectivo: nuevoBoleto.idColectivo,
          precio: nuevoBoleto.precio,
          destino: nuevoBoleto.destino,
          asientos: asientosSeleccionados,
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      console.log("Boleto comprado:", response.data);
      // Limpiar el formulario después de comprar el boleto
      setNuevoBoleto({ idColectivo: "", precio: "", destino: "" });
      // Limpiar asientos seleccionados
      setAsientosSeleccionados([]);
    } catch (error) {
      console.error("Error al comprar boleto:", error);
    }
  };

  const handleSeleccionarAsiento = (idAsiento) => {
    // Verificar si el asiento ya está seleccionado
    const isSelected = asientosSeleccionados.includes(idAsiento);

    if (isSelected) {
      // Si está seleccionado, quitarlo de la lista
      setAsientosSeleccionados(asientosSeleccionados.filter((id) => id !== idAsiento));
    } else {
      // Si no está seleccionado, agregarlo a la lista
      setAsientosSeleccionados([...asientosSeleccionados, idAsiento]);
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
      <button variant="primary" onClick={handleComprarBoleto}>Comprar Boleto</button>

      <h2>Asientos Disponibles</h2>
      <div className="fila-asientos">
        {asientos.map((asiento) => (
          <div
            key={asiento.id}
            className={`asiento ${asiento.estado === "ocupado" ? "ocupado" : "libre"}`}
            onClick={() => handleSeleccionarAsiento(asiento.id)}
          >
            {asiento.numero}
          </div>
        ))}
      </div>

      <h2>Asientos Seleccionados</h2>
      <p>{asientosSeleccionados.join(", ")}</p>
    </>
  );
};

