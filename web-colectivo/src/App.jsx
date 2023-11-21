import { Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { Layout } from "./pages/Layout";
import { LoginPage } from "./pages/LoginPage";
import { Boleto } from "./pages/Boleto";
import { RequiredAuth } from "./context/RequireAuth";
import { VendedorPage } from "./pages/VendedorPage";
import { SinRuta } from "./pages/SinRuta";

function App() {
  return (
    <>
      <h1>Aplicacion</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/acerca-de/:id" element={<AboutPage />} />
          <Route
            path="/boleto"
            element={
              <RequiredAuth>
                <Boleto />
              </RequiredAuth>
            }
          />
          <Route path="/vendedor" element={<VendedorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<SinRuta />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
