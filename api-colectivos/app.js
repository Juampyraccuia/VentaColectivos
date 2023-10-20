import express from "express";
import cors from "cors";
import { asientosRouter } from "./asientos.js";
import { ventasRouter } from "./ventas.js";
import { pasajeroRouter } from "./pasajero.js";
import { vendedorRouter } from "./vendedor.js";


const app = express();
app.use(express.json());
app.use(cors());
app.use("./asientos", asientosRouter);
app.use("./ventas", ventasRouter);
app.use("/pasajeros", pasajeroRouter);
app.use("/vendedor", vendedorRouter)

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// Pongo en funcionamiento la API en puerto 3000

app.listen(3000, () => {
  console.log("API en funcionamiento");
});
