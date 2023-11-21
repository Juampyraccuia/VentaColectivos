import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

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
    <div className="container">
      <Form onSubmit={onSubmit}>
        <h2 className="mb-4">Iniciar sesión</h2>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control name="usuario" type="text" placeholder="Ingrese su usuario" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control name="password" type="password" placeholder="Ingrese su contraseña" />
        </Form.Group>
        <Button variant="warning" type="submit">
          Ingresar
        </Button>
      </Form>
      {error && (
        <p className="text-danger mt-3">Usuario o contraseña inválido</p>
      )}
    </div>
  );
};