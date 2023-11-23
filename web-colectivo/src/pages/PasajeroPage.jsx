import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import "../css/pasajero.css";

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
    <Container>
      <Row>
        <Col className="text-center">
          <h2>Agregar Pasajero</h2>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre:</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoPasajero.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido:</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={nuevoPasajero.apellido}
                onChange={handleChange}
              />
            </Form.Group>
            <br />
            <Button
              variant="outline-success"
              size="lg"
              onClick={handleAgregarPasajero}
              id="bnt-agregar"
            >
              Agregar Pasajero
            </Button>
            {idPasajeroEditando && (
              <Button
                variant="outline-success"
                size="lg"
                onClick={handleConfirmarEdicion}
                id="bnt-guardar"
              >
                Guardar
              </Button>
            )}
          </Form>
        </Col>

        <Col className="text-center">
          <h2>Buscar Pasajero</h2>
          <Form.Group controlId="formBusqueda">
            <Form.Label>Buscar por nombre completo:</Form.Label>
            <Form.Control
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleBuscarPasajero}
            id="bnt-buscar"
          >
            Buscar
          </Button>
          <br />
          <h2>Listado de Pasajeros</h2>
          <ListGroup>
            {pasajeros.map((pasajero) => (
              <ListGroup.Item key={pasajero.idpasajero}>
                <Row>
                  <Col>{`${pasajero.nombre} ${pasajero.apellido}`}</Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleEliminarPasajero(pasajero.idpasajero)
                      }
                      className="mr-2"
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleEditarPasajero(pasajero)}
                    >
                      Editar
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};
