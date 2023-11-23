import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { Form, Button, Alert, Row, Col, Modal } from "react-bootstrap";

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
  const [showModal, setShowModal] = useState(false);

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
        const responseAsientos = await axios.get(
          "http://localhost:3000/asientos"
        );
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
        const responseColectivos = await axios.get(
          "http://localhost:3000/colectivos"
        );
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

    // Mostrar el Modal después de comprar el boleto
    setShowModal(true);
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
      setMensaje("El asiento está ocupado. Por favor, elija otro.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoBoleto((prevBoleto) => ({
      ...prevBoleto,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const obtenerNombreColectivo = (idColectivo) => {
    const colectivo = colectivos.find((c) => c.idcolectivo === idColectivo);
    return colectivo ? colectivo.nombre : "Desconocido";
  };

  return (
    <Row>
      <Col>
        <h2>
          <center>Comprar Boleto</center>
        </h2>
        <Form>
          <Form.Group controlId="formColectivo">
            <Form.Label>Colectivo:</Form.Label>
            <Form.Control
              as="select"
              name="idColectivo"
              value={nuevoBoleto.idColectivo}
              onChange={handleChange}
            >
              <option value="">Seleccionar Colectivo</option>
              {colectivos.map((colectivo) => (
                <option
                  key={colectivo.idcolectivo}
                  value={colectivo.idcolectivo}
                >
                  {colectivo.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPrecio">
            <Form.Label>Precio:</Form.Label>
            <Form.Control
              type="text"
              name="precio"
              value={nuevoBoleto.precio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDestino">
            <Form.Label>Destino:</Form.Label>
            <Form.Control
              as="select"
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
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAsiento">
            <Form.Label>Asientos:</Form.Label>
            <Form.Control
              as="select"
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
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={handleComprarBoleto}>
            Comprar Boleto
          </Button>
        </Form>
      </Col>

      <Col>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Compra Exitosa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{mensaje}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  );
};

