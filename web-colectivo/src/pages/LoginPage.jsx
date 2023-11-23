import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../css/loginpage.css";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    const usuario = formData.get("usuario");
    const password = formData.get("password");

    login(
      usuario,
      password,
      () => navigate(from, { replace: true }),
      () => setError(true)
    );

    event.preventDefault();
  };

  return (
    <>
      <div id="formulario">
        <Form onSubmit={onSubmit} id="loginForm">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              name="usuario"
              placeholder="Ingrese su usuario"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
            />
          </Form.Group>
          <Button variant="outline-dark" type="submit">
            Submit
          </Button>
        </Form>
      </div>

      {error && <p>Usuario o contraseña inválido</p>}
    </>
  );
};