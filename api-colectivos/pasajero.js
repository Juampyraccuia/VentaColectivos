import express from "express";
import { db } from "./db.js";


export const pasajeroRouter = express.Router()

  .get("/", async (req, res) => {
    cosnt[rows, fields] = await db.execute(
      "SELECT * FROM pasajeros"
    );
    res.send(rows)
  })

  .get("/:id/pasajeros", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT id, nombre, apellido, dni FROM pasajeros WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  });