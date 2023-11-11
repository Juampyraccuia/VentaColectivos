import { Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { LoginPage } from "./LoginPage";
import { Pasajeros } from "./Pasajeros";
import { Boleto } from "./Boleto";

function App() {
  return (
    <>
      <h1>Venta de boletos para colectivos</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/pasajeros" element={<Pasajeros />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/boleto" element={<Boleto />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
