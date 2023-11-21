import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const ventasRouter = express.Router();

// Obtener todas las ventas
ventasRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM ventas");
  res.send(rows);
});

// Obtener una venta por ID
ventasRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM ventas WHERE idventa = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Venta no encontrada" });
  }
});

// Crear una nueva venta
ventasRouter.post(
  "/",
  body("idvendedor").isNumeric(),
  body("idboleto").isNumeric(),
  body("fecha").isISO8601().toDate(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { idvendedor, idboleto, fecha } = req.body;

    await db.execute(
      "INSERT INTO ventas (idvendedor, idboleto, fecha) VALUES (?, ?, ?)",
      [idvendedor, idboleto, fecha]
    );
    res.status(201).send("La venta ha sido creada correctamente.");
  }
);

// Actualizar una venta por ID
ventasRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { idvendedor, idboleto, fecha } = req.body;

  await db.execute(
    "UPDATE ventas SET idvendedor = ?, idboleto = ?, fecha = ? WHERE idventa = ?",
    [idvendedor, idboleto, fecha, id]
  );
  res.status(200).send("La venta ha sido actualizada correctamente.");
});

// Eliminar una venta por ID
ventasRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM ventas WHERE idventa = ?", [id]);
  res.status(200).send("La venta ha sido eliminada correctamente.");
});
