import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";

export const Layout = () => {
  return (
    <>
      <AuthStatus />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to={`/acerca-de`}>Acerca de...</Link>
          </li>
          <li>
            <Link to="/vendedor">Vendedores</Link>
          </li>
          <li>
            <Link to="/boleto">Compra de boletos</Link>
          </li>
          <li>
            <Link to="/pasajero">Nuevo cliente</Link>
          </li>
          <li>
            <Link to="/login">Ingresar</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
