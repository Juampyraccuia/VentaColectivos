import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const pasajerosRouter = express.Router();

// Obtener todos los pasajeros
pasajerosRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM pasajeros");
  res.send(rows);
});

// Obtener un pasajero por ID
pasajerosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM pasajeros WHERE idpasajero = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Pasajero no encontrado" });
  }
});

// Crear un nuevo pasajero
pasajerosRouter.post(
  "/",
  body("nombre").isString().isLength({ min: 1, max: 255 }),
  body("apellido").isString().isLength({ min: 1, max: 255 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { nombre, apellido } = req.body;

    await db.execute(
      "INSERT INTO pasajeros (nombre, apellido) VALUES (?, ?)",
      [nombre, apellido]
    );
    res.status(201).send("El pasajero ha sido creado correctamente.");
  }
);

// Actualizar un pasajero por ID
pasajerosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido } = req.body;

  await db.execute(
    "UPDATE pasajeros SET nombre = ?, apellido = ? WHERE idpasajero = ?",
    [nombre, apellido, id]
  );
  res.status(200).send("El pasajero ha sido actualizado correctamente.");
});

// Eliminar un pasajero por ID
pasajerosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM pasajeros WHERE idpasajero = ?", [id]);
  res.status(200).send("El pasajero ha sido eliminado correctamente.");
});
