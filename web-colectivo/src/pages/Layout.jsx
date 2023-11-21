import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";
import { useAuthContext } from "../context/AuthContext";

export const Layout = () => {
  const { sesion } = useAuthContext();

  return (
    <>
      <AuthStatus />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!sesion && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              
            </>
          )}
          {sesion && (
            <>
              <li>
                <Link to={`/acerca-de`}>Acerca de...</Link>
              </li>
              <li>
                <Link to="/vendedor">Vendedores</Link>
              </li>
              <li>
                <Link to="/pasajero">Nuevo cliente</Link>
              </li>
              <li>
                <Link to="/asientos">asientos</Link>
              </li>
              
            </>
          )}

        </ul>
      </nav>
      <Outlet />
    </>
  );
};
