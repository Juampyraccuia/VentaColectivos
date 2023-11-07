import express from "express";
import { db } from "./db.js";


export const pasajeroRouter = express.Router();


pasajeroRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.pasajeros");
  res.send(rows);
})

  .get("/:id/pasajeros", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT id, nombres, apellidos, dni FROM pasajeros WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  })

  .post("/pasajeros", async (req, res) => {
    const pasajero = req.body;
    const [rows] = await db.execute(
      `INSERT INTO ventacolectivos.pasajeros (nombres, apellidos, dni, fechaNac)
      VALUES(: nombres, : apellidos, : dni, : fechaNac)`,
      { nombres: pasajero.nombres, apellidos: pasajero.apellidos, dni: pasajero.dni, fechaNac: pasajero.fechaNac }
    );
    res.status(201).send({ nombres: pasajero.nombres, apellidos: pasajero.apellidos, id: rows.insertId });
  });