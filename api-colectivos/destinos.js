import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const destinosRouter = express.Router();

// Obtener todos los destinos
destinosRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM colectivos.destinos");
  res.send(rows);
});

// Obtener un destino por ID
destinosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM colectivos.destinos WHERE iddestino = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Destino no encontrado" });
  }
});

// Crear un nuevo destino
destinosRouter.post(
  "/",
  body("nombre").isString().isLength({ min: 1, max: 255 }),
  body("precio").isNumeric(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { nombre, precio } = req.body;

    await db.execute(
      "INSERT INTO colectivos.destinos (nombre, precio) VALUES (?, ?)",
      [nombre, precio]
    );
    res.status(201).send("El destino ha sido creado correctamente.");
  }
);

// Actualizar un destino por ID
destinosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, precio } = req.body;

  await db.execute(
    "UPDATE colectivos.destinos SET nombre = ?, precio = ? WHERE iddestino = ?",
    [nombre, precio, id]
  );
  res.status(200).send("El destino ha sido actualizado correctamente.");
});

// Eliminar un destino por ID
destinosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM colectivos.destinos WHERE iddestino = ?", [id]);
  res.status(200).send("El destino ha sido eliminado correctamente.");
});
