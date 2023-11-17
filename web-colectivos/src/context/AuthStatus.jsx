import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export const AuthStatus = () => {
  const { sesion, logout } = useAuthContext();
  const navigate = useNavigate();

  if (!sesion) {
    return <p>No se conecto ningun vendedor</p>;
  }

  return (
    <>
      <p>Vendedor {sesion.usuario} conectado</p>
      <button
        onClick={() => {
          logout(navigate);
        }}
      >
        Cerrar Sesión
      </button>
    </>
  );
};
