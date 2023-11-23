import { Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { Layout } from "./pages/Layout";
import { LoginPage } from "./pages/LoginPage";
import { Boleto } from "./pages/Boleto";
import { RequiredAuth } from "./context/RequireAuth";
import { VendedorPage } from "./pages/VendedorPage";
import { PasajeroPage } from "./pages/pasajeroPage";
import { SinRuta } from "./pages/SinRuta";
import "./css/app.css";

function App() {
  return (
    <>
 <main>
        <h1>
          <center>
            Sistema de venta para boletos de colectivos de larga distancia{" "}
          </center>
        </h1>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/acerca-de" element={<AboutPage />} />
            <Route
              path="/boleto"
              element={
                <RequiredAuth>
                  <Boleto />
                </RequiredAuth>
              }
            />
            <Route
              path="/vendedor"
              element={
                <RequiredAuth>
                  <VendedorPage />
                </RequiredAuth>
              }
            />
            <Route
              path="/pasajero"
              element={
                <RequiredAuth>
                  <PasajeroPage />
                </RequiredAuth>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<SinRuta />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
