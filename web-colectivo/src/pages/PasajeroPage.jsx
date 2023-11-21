import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const PasajeroPage = () => {
  const { sesion } = useAuthContext();
  const [nuevoPasajero, setNuevoPasajero] = useState({
    nombre: "",
    apellido: "",
  });
  const [busqueda, setBusqueda] = useState("");
  const [pasajeros, setPasajeros] = useState([]);
  const [pasajerosCompletos, setPasajerosCompletos] = useState([]);
  const [idPasajeroEditando, setIdPasajeroEditando] = useState(null);

  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pasajeros", {
          headers: { Authorization: `Bearer ${sesion.token}` },
        });
        setPasajerosCompletos(response.data);
        setPasajeros(response.data);
      } catch (error) {
        console.error("Error al obtener pasajeros:", error);
      }
    };

    if (sesion && sesion.token) {
      fetchPasajeros();
    }
  }, [sesion, idPasajeroEditando]);

  const fetchPasajeros = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pasajeros", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setPasajerosCompletos(response.data);
      setPasajeros(response.data);
    } catch (error) {
      console.error("Error al obtener pasajeros:", error);
    }
  };

  const handleAgregarPasajero = async () => {
    try {
      if (idPasajeroEditando) {
        await axios.put(
          `http://localhost:3000/pasajeros/${idPasajeroEditando}`,
          {
            nombre: nuevoPasajero.nombre,
            apellido: nuevoPasajero.apellido,
          },
          {
            headers: { Authorization: `Bearer ${sesion.token}` },
          }
        );
        console.log("Pasajero editado");
        fetchPasajeros();
        setNuevoPasajero({ nombre: "", apellido: "" });
        setIdPasajeroEditando(null);
      } else {
        const response = await axios.post(
          "http://localhost:3000/pasajeros",
          {
            nombre: nuevoPasajero.nombre,
            apellido: nuevoPasajero.apellido,
          },
          {
            headers: { Authorization: `Bearer ${sesion.token}` },
          }
        );
        console.log("Pasajero agregado:", response.data);
        fetchPasajeros();
        setNuevoPasajero({ nombre: "", apellido: "" });
      }
    } catch (error) {
      console.error("Error al agregar/editar pasajero:", error);
    }
  };

  const handleBuscarPasajero = () => {
    if (!busqueda.trim()) {
      console.log("No hay búsqueda, reiniciando lista de pasajeros");
      setPasajeros(pasajerosCompletos);
      return;
    }

    const resultadoBusqueda = pasajerosCompletos.filter((pasajero) => {
      const nombreCompleto =
        pasajero.nombre && pasajero.apellido
          ? `${pasajero.nombre} ${pasajero.apellido}`
          : null;

      if (!nombreCompleto) {
        console.log("Nombre completo no definido para el pasajero:", pasajero);
        return false;
      }

      const busquedaEnMinusculas = busqueda.toLowerCase();

      return nombreCompleto.toLowerCase().includes(busquedaEnMinusculas);
    });

    setPasajeros(resultadoBusqueda);
    console.log("Resultado de la búsqueda:", resultadoBusqueda);
  };

  const handleEliminarPasajero = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/pasajeros/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      console.log("Pasajero eliminado");
      fetchPasajeros();
    } catch (error) {
      console.error("Error al eliminar pasajero:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPasajero((prevPasajero) => ({
      ...prevPasajero,
      [name]: value,
    }));
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleEditarPasajero = (pasajero) => {
    setNuevoPasajero({
      nombre: pasajero.nombre,
      apellido: pasajero.apellido,
    });
    setIdPasajeroEditando(pasajero.idpasajero);
  };

  const handleConfirmarEdicion = async () => {
    try {
      if (idPasajeroEditando) {
        await axios.put(
          `http://localhost:3000/pasajeros/${idPasajeroEditando}`,
          {
            nombre: nuevoPasajero.nombre,
            apellido: nuevoPasajero.apellido,
          },
          {
            headers: { Authorization: `Bearer ${sesion.token}` },
          }
        );
        console.log("Pasajero editado");
        fetchPasajeros();
        setNuevoPasajero({ nombre: "", apellido: "" });
        setIdPasajeroEditando(null);
      }
    } catch (error) {
      console.error("Error al editar pasajero:", error);
    }
  };

  return (
    <>
      <h2>Agregar Pasajero</h2>
      <label>
        Nombre:
        <input
          type="text"
          name="nombre"
          value={nuevoPasajero.nombre}
          onChange={handleChange}
        />
      </label>
      <label>
        Apellido:
        <input
          type="text"
          name="apellido"
          value={nuevoPasajero.apellido}
          onChange={handleChange}
        />
      </label>
      {idPasajeroEditando && (
        <button onClick={handleConfirmarEdicion}>Guardar</button>
      )}
      <button onClick={handleAgregarPasajero}>Agregar Pasajero</button>

      <h2>Buscar, Eliminar y Editar Pasajero</h2>
      <label>
        Buscar por nombre completo:
        <input type="text" value={busqueda} onChange={handleBusquedaChange} />
      </label>
      <button onClick={handleBuscarPasajero}>Buscar</button>

      <ul>
        {pasajeros.map((pasajero) => (
          <li key={pasajero.idpasajero}>
            {`${pasajero.nombre} ${pasajero.apellido}`}{" "}
            <button onClick={() => handleEliminarPasajero(pasajero.idpasajero)}>
              Eliminar
            </button>
            <button onClick={() => handleEditarPasajero(pasajero)}>
              Editar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
