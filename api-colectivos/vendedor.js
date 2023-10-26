import express from "express";
import { db } from "./db.js";


export const vendedorRouter = express.Router()

  vendedorRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.vendedor");
    res.send(rows);
  })
  // pasajeroRouter.get("/", async (req, res) => {
  //   const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.pasajeros");
  //   res.send(rows);
  // })
    

  .get("/:id/vendedor", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT nombre, apellido, total, horario FROM vendedor WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Vendedor no encontrado" });
    }
  });