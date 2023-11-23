import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";
import { useAuthContext } from "../context/AuthContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../css/Layout.css";
export const Layout = () => {
  const { sesion } = useAuthContext();

  return (
    <>
      <div id="menu">
        <Navbar bg="info">
          <Container>
            <Navbar.Brand href="/">Venta Colectivo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="me-auto">
              {!sesion && (
                <Nav.Link>
                  <Link to="/login">Login</Link>
                </Nav.Link>
              )}
              {sesion && (
                <>
                  <Nav.Link>
                    <Link to="/">Home</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/acerca-de"> Acerca de...</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/vendedor">Vendedores</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/boleto">Comprar Boletos</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/pasajero">Nuevo cliente</Link>
                  </Nav.Link>
                  <Nav.Link href="/">Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </div>

      <AuthStatus />

      <Outlet />
    </>
  );
};
