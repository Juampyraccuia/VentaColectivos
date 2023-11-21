import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export const AuthStatus = () => {
  const { sesion, logout } = useAuthContext();
  const navigate = useNavigate();

  if (!sesion) {
    return <p>No esta conectado</p>;
  }

  return (
    <>
      <p>Conectado como {sesion.usuario}</p>
      <button onClick={() => logout(() => navigate("/"))}>Salir</button>
    </>
  );
};
