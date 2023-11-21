import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";

export const vendedoresRouter = express.Router();

// Obtener todos los vendedores
vendedoresRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM vendedores");
  res.send(rows);
});

// Obtener un vendedor por ID
vendedoresRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute(
    "SELECT * FROM vendedores WHERE idvendedor = ?",
    [id]
  );
  if (rows.length > 0) {
    res.send(rows[0]);
  } else {
    res.status(404).send({ mensaje: "Vendedor no encontrado" });
  }
});

// Crear un nuevo vendedor
vendedoresRouter.post(
  "/",
  body("idvendedor").isNumeric().isLength({ min: 1, max: 255 }),
  body("nombre").isString().isLength({ min: 1, max: 255 }),
  body("apellido").isString().isLength({ min: 1, max: 255 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { idvendedor, nombre, apellido } = req.body;

    await db.execute(
      "INSERT INTO vendedores (idvendedor , nombre, apellido) VALUES (?, ?,?)",
      [idvendedor, nombre, apellido]
    );
    res.status(201).send("El vendedor ha sido creado correctamente.");
  }
);

// Actualizar un vendedor por ID
vendedoresRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido } = req.body;

  await db.execute(
    "UPDATE vendedores SET nombre = ?, apellido = ? WHERE idvendedor = ?",
    [nombre, apellido, id]
  );
  res.status(200).send("El vendedor ha sido actualizado correctamente.");
});

// Eliminar un vendedor por ID
vendedoresRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM vendedores WHERE idvendedor = ?", [id]);
  res.status(200).send("El vendedor ha sido eliminado correctamente.");
});
