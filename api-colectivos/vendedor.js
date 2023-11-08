import express from "express";
import { db } from "./db.js";
export const vendedorRouter = express.Router();

vendedorRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute(
    "SELECT idvendedor, nombre, apellido FROM ventacolectivos.vendedor"
  );
  res.send(rows);
})


  .get("/ventas", async (req, res) => {
    const [rows, fields] = await db.execute(
      `SELECT vendedor.nombre, SUM(ventas.montoTotal) AS total_de_ventas FROM ventacolectivos.vendedor 
    JOIN ventacolectivos.ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor GROUP BY vendedor.nombre`
    );
    res.send(rows);
  })
  .get("/:nombre", async (req, res) => {
    const nombre = req.params.nombre;
    const [rows, fields] = await db.execute(
      `SELECT vendedor.idvendedor, ventas.idventa, SUM(ventas.montoTotal) AS total_de_ventas FROM ventacolectivos.vendedor
      JOIN ventacolectivos.ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor WHERE vendedor.nombre = :nombre
      GROUP BY vendedor.idvendedor, ventas.idventa`,
      { nombre }
    );
    res.send(rows);
  })

  .post("/", async (req, res) => {
    const vendedor = req.body;
    const nombre = vendedor.nombre || null;
    const apellido = vendedor.apellido || null;

    const [result] = await db.execute(
      "INSERT INTO ventacolectivos.vendedor (nombre, apellido) VALUES (?, ?)",
      [nombre, apellido]
    );

    res.status(201).send({ nombre, apellido, idvendedor: result.insertId });
  })


  .delete("/:idvendedor", async (req, res) => {
    const idVendedor = req.params.idvendedor;
    const [result] = await db.execute(
      "DELETE FROM ventacolectivos.vendedor WHERE idvendedor = :idvendedor",
      { idVendedor }
    );
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send({ mensaje: "Vendedor no encontrado" });
    }
  })
