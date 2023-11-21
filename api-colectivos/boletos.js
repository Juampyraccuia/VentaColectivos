import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const boletosRouter = express.Router();

// Obtener todos los boletos
boletosRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM boletos");
  res.send(rows);
});

// Obtener un boleto por ID
boletosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM boletos WHERE idboleto = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Boleto no encontrado" });
  }
});

// Crear un nuevo boleto
boletosRouter.post(
  "/",
  body("idcolectivo").isNumeric(),
  body("precio").isNumeric(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { idcolectivo, precio } = req.body;

    await db.execute(
      "INSERT INTO boletos (idcolectivo, precio) VALUES (?, ?)",
      [idcolectivo, precio]
    );
    res.status(201).send("El boleto ha sido creado correctamente.");
  }
);

// Actualizar un boleto por ID
boletosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { idcolectivo, precio } = req.body;

  await db.execute(
    "UPDATE boletos SET idcolectivo = ?, precio = ? WHERE idboleto = ?",
    [idcolectivo, precio, id]
  );
  res.status(200).send("El boleto ha sido actualizado correctamente.");
});

// Eliminar un boleto por ID
boletosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM boletos WHERE idboleto = ?", [id]);
  res.status(200).send("El boleto ha sido eliminado correctamente.");
});
