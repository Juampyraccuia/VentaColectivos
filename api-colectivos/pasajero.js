import express from "express";
import { db } from "./db.js";


export const pasajeroRouter = express.Router();


pasajeroRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.pasajeros");
  res.send(rows);
})

  .get("/:dni", async (req, res) => {
    const dni = req.params.dni;
    const [rows, fields] = await db.execute(
      "SELECT  nombres, apellido, dni FROM pasajeros WHERE dni = :dni",
      { dni }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  })

  .post("/", async (req, res) => {
    const pasajero = req.body;
    const nombres = pasajero.nombres || null;
    const apellido = pasajero.apellido || null;
    const dni = pasajero.dni || null;
    const fechaNac = pasajero.fechaNac || null;

    const [rows] = await db.execute(
      `INSERT INTO ventacolectivos.pasajeros (nombres, apellido, dni, fechaNac)
    VALUES (?, ?, ?, ?)`,
      [nombres, apellido, dni, fechaNac]
    );

    res.status(201).send({ nombres, apellido, id: rows.insertId });
  })

  .delete("/:dni", async (req, res) => {
    const dni = req.params.dni;
    const [result] = await db.execute(
      "DELETE FROM pasajeros WHERE dni = :dni",
      { dni }
    );
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  })
