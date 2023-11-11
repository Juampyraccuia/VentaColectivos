import { Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { Layout } from "./Pages/Layout";
import { LoginPage } from "./Pages/LoginPage";
import { Pasajeros } from "./Pages/Pasajeros";
import { Boleto } from "./Pages/Boleto";
import { Vendedores } from "./Pages/Vendedores";

function App() {
  return (
    <>
      <h1>
        <center>Venta de boletos para colectivos</center>
      </h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/pasajeros" element={<Pasajeros />} />
          <Route path="/boleto" element={<Boleto />} />
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
