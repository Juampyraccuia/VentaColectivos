import { Link, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pasajeros">Pasajeos</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/boleto">Comprar Boleto</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
