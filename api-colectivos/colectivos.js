import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const colectivosRouter = express.Router();

// Obtener todos los colectivos
colectivosRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM colectivos");
  res.send(rows);
});

// Obtener un colectivo por ID
colectivosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM colectivos WHERE idcolectivo = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Colectivo no encontrado" });
  }
});

// Crear un nuevo colectivo
colectivosRouter.post(
  "/",
  body("nombre").isString().isLength({ min: 1, max: 255 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { nombre } = req.body;

    await db.execute(
      "INSERT INTO colectivos (nombre) VALUES (?)",
      [nombre]
    );
    res.status(201).send("El colectivo ha sido creado correctamente.");
  }
);

// Actualizar un colectivo por ID
colectivosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;

  await db.execute(
    "UPDATE colectivos SET nombre = ? WHERE idcolectivo = ?",
    [nombre, id]
  );
  res.status(200).send("El colectivo ha sido actualizado correctamente.");
});

// Eliminar un colectivo por ID
colectivosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM colectivos WHERE idcolectivo = ?", [id]);
  res.status(200).send("El colectivo ha sido eliminado correctamente.");
});
