import { Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { Layout } from "./Pages/Layout";
import { LoginPage } from "./Pages/LoginPage";
import { Pasajeros } from "./Pages/Pasajeros";
import { Boleto } from "./Pages/Boleto";
import { Vendedores } from "./Pages/Vendedores";
import { RequiredAuth } from "./context/RequireAuth";

function App() {
  return (
    <>
      <h1>
        <center>Venta de boletos para colectivos</center>
      </h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/pasajeros"
            element={
              <RequiredAuth>
                <Pasajeros />
              </RequiredAuth>
            }
          />
          <Route
            path="/boleto"
            element={
              <RequiredAuth>
                <Boleto />
              </RequiredAuth>
            }
          />
          <Route
            path="/vendedores"
            element={
              <RequiredAuth>
                <Vendedores />
              </RequiredAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
