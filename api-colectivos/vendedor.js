import express from "express";
import { db } from "./db.js";
export const vendedorRouter = express.Router();

vendedorRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute(
    `SELECT vendedor.nombre, SUM(ventas.monto_total) AS total_ventas FROM vendedor 
    JOIN ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor GROUP BY vendedor.nombre`
  );
  res.send(rows);
})
  .get("/:nombre", async (req, res) => {
    const nombre = req.params.nombre;
    const [rows, fields] = await db.execute(
      `SELECT vendedor.idvendedor, ventas.idventa, SUM(ventas.monto_total) AS total_ventas FROM vendedor
      JOIN ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor WHERE vendedor.nombre = :nombre
      GROUP BY vendedor.idvendedor, ventas.idventa`,
      { nombre }
    );
    res.send(rows);
  });