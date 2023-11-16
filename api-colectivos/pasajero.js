import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";



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

  .post("/",
    body("pasajero.nombres").isAlpha().isLength({ min: 1, max: 100 }),
    body("pasajero.apellido").isAlpha().isLength({ min: 1, max: 45 }),
    body("pasajero.dni").isNumeric().isLength({ min: 1, max: 8 }),
    body("pasajero.fechaNac").isISO8601(),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const pasajero = req.body.pasajero; // Accede a los datos de pasajero
      const [rows] = await db.execute(
        'INSERT INTO ventacolectivos.pasajero (nombres, apellido, dni, fechaNac) VALUES (?, ?, ?, ?)',
        [pasajero.nombres, pasajero.apellido, pasajero.dni, pasajero.fechaNac]
      );
      res.status(201).send({ nombres: pasajero.nombres, apellido: pasajero.apellido, id: rows.insertId });
    }
  )

  .delete("/:dni", async (req, res) => {
    const dni = req.params.dni;
    const [result] = await db.execute(
      "DELETE FROM pasajero WHERE dni = :dni",
      { dni }
    );
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  })
