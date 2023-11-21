import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const asientosRouter = express.Router();

// Obtener todos los asientos
asientosRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM colectivos.asientos");
  res.send(rows);
});

// Obtener un asiento por ID
asientosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM colectivos.asientos WHERE idasiento = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Asiento no encontrado" });
  }
});

// Obtener información detallada de un asiento por ID
asientosRouter.get("/:id/detalle", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    `SELECT a.idasiento, a.numero, a.estado, c.idcolectivo, c.nombre AS nombreColectivo
    FROM asientos a
    JOIN colectivos c ON a.idcolectivo = c.idcolectivo
    WHERE a.idasiento = ?`,
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Asiento no encontrado" });
  }
});

// Crear un nuevo asiento
// Crear un nuevo asiento
asientosRouter.post(
  "/",
  body("asiento.numero").isNumeric().isLength({ min: 1, max: 2 }),
  body("asiento.estado").isAlpha().isLength({ min: 1, max: 45 }),
  body("asiento.idcolectivo").isNumeric().isLength({ min: 1, max: 2 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { numero, estado, idcolectivo } = req.body.asiento;

    const [rows] = await db.execute(
      "SELECT * FROM colectivos.asientos WHERE numero = ? AND estado = 'reservado'",
      [numero]
    );
    if (rows.length > 0) {
      res.status(409).send("El asiento está ocupado.");
      return;
    }

    await db.execute(
      "INSERT INTO colectivos.asientos (numero, estado, idcolectivo) VALUES (?, ?, ?)",
      [numero, estado, idcolectivo]
    );
    res.status(201).send("El asiento ha sido reservado correctamente.");
  }
);

// Actualizar un asiento por ID
asientosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { numero, estado } = req.body;

  await db.execute(
    "UPDATE colectivos.asientos SET numero = ?, estado = ? WHERE idasiento = ?",
    [numero, estado, id]
  );
  res.status(200).send("El asiento ha sido actualizado correctamente.");
});

// Eliminar un asiento por ID
asientosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM colectivos.asientos WHERE idasiento = ?", [id]);
  res.status(200).send("El asiento ha sido eliminado correctamente.");
});
