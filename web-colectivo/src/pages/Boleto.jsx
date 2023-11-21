import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Boleto = () => {
  const { sesion } = useAuthContext();
  const [nuevoBoleto, setNuevoBoleto] = useState({
    idColectivo: "",
    precio: "",
    destino: "",
    asiento: "",
  });

  const [destinos, setDestinos] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(
          "Error al obtener los asientos. Inténtalo de nuevo más tarde."
        );
      }
    };

    obtenerAsientos();
  }, []);

  const handleComprarBoleto = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/boletos",
        {
          idcolectivo: nuevoBoleto.idColectivo,
          precio: nuevoBoleto.precio,
          destino: nuevoBoleto.destino,
          asiento: nuevoBoleto.asiento,
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      console.log("Boleto comprado:", response.data);
      setNuevoBoleto({
        idColectivo: "",
        precio: "",
        destino: "",
        asiento: "",
      });
      setAsientosSeleccionados([]);
    } catch (error) {
      console.error("Error al comprar boleto:", error);
    }
  };

  const handleSeleccionarAsiento = async (idAsiento) => {
    try {
      const isSelected = asientosSeleccionados.includes(idAsiento);

      if (isSelected) {
        setAsientosSeleccionados(
          asientosSeleccionados.filter((id) => id !== idAsiento)
        );
      } else {
        const response = await axios.get(
          `http://localhost:3000/asientos/${idAsiento}/detalle`
        );
        const asientoDetalle = response.data;

        if (asientoDetalle.estado === "libre") {
          setAsientosSeleccionados([...asientosSeleccionados, idAsiento]);
        } else {
          console.log("El asiento está ocupado. Por favor, elija otro.");
        }
      }
    } catch (error) {
      console.error("Error al seleccionar asiento:", error);
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
        ID colectivo:
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
      <label>
        Asientos:
        <select
          name="asiento"
          value={nuevoBoleto.asiento}
          onChange={handleChange}
        >
          <option value="">Seleccionar Asiento</option>
          {asientos.map((asiento) => (
            <option key={asiento.idasiento} value={asiento.numero}>
              {asiento.numero}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleComprarBoleto}>Comprar Boleto</button>
    </>
  );
};
