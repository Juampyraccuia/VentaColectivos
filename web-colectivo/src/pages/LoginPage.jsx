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
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="usuario">Usuario:</label>
        <input name="usuario" type="text" />
        <label htmlFor="password">Contraseña:</label>
        <input name="password" type="password" />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p>Usuario o contraseña inválido</p>}
    </>
  );
};