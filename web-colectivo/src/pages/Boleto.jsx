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
  const [colectivos, setColectivos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [estadoAsiento, setEstadoAsiento] = useState("");
  const [mensaje, setMensaje] = useState("");
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

    const obtenerAsientos = async () => {
      try {
        const responseAsientos = await axios.get("http://localhost:3000/asientos");
        setAsientos(responseAsientos.data);
        setError(null);
      } catch (error) {
        console.error("Error al obtener los asientos:", error);
        setError(
          "Error al obtener los asientos. Inténtalo de nuevo más tarde."
        );
      }
    };

    const obtenerColectivos = async () => {
      try {
        const responseColectivos = await axios.get("http://localhost:3000/colectivos");
        setColectivos(responseColectivos.data);
      } catch (error) {
        console.error("Error al obtener colectivos:", error);
      }
    };

    fetchDestinos();
    obtenerAsientos();
    obtenerColectivos();
  }, []);

  const handleComprarBoleto = async () => {
    try {
      const responseAsiento = await axios.get(
        `http://localhost:3000/asientos/${nuevoBoleto.asiento}/detalle`
      );
      const asientoDetalle = responseAsiento.data;
  
      if (asientoDetalle.estado === "libre") {
        const responseBoleto = await axios.post(
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
  
        setMensaje(`Boleto comprado: ${responseBoleto.data}`);
  
        // Actualizar el estado del asiento a 'reservado' mediante la solicitud PUT
        await axios.put(
          `http://localhost:3000/asientos/${nuevoBoleto.asiento}`,
          { estado: "reservado" }
        );
  
        setNuevoBoleto({
          idColectivo: "",
          precio: "",
          destino: "",
          asiento: "",
        });
        setAsientosSeleccionados([]);
      } else {
        setMensaje("El asiento no está libre. Por favor, elija otro.");
      }
    } catch (error) {
      console.error("Error al comprar boleto:", error);
      setError("Error al comprar boleto. Inténtalo de nuevo más tarde.");
    }
  };
  

  const handleSeleccionarAsiento = async (idAsiento) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/asientos/${idAsiento}/detalle`
      );
      const asientoDetalle = response.data;

      if (asientoDetalle.estado === "libre") {
        setAsientosSeleccionados([idAsiento]);
        setEstadoAsiento(asientoDetalle.estado);
        setMensaje("");
      } else {
        setMensaje("El asiento está ocupado. Por favor, elija otro.");
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

  const obtenerNombreColectivo = (idColectivo) => {
    const colectivo = colectivos.find((c) => c.idcolectivo === idColectivo);
    return colectivo ? colectivo.nombre : "Desconocido";
  };

  return (
    <>
      <h2>Comprar Boleto</h2>
     < label>
  Colectivo:
  <select
    name="idColectivo"
    value={nuevoBoleto.idColectivo}
    onChange={handleChange}
  >
    <option value="">Seleccionar Colectivo</option>
    {colectivos.map((colectivo) => (
      <option key={colectivo.idcolectivo} value={colectivo.idcolectivo}>
        {colectivo.nombre}
      </option>
    ))}
  </select>
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
        {`Número: ${asiento.numero} - Estado: ${asiento.estado}`}
      </option>
    ))}
  </select>
</label>
      <button variant="primary" onClick={handleComprarBoleto}>
        Comprar Boleto
      </button>
      {mensaje && <p>{mensaje}</p>}
    </>
  );
};
