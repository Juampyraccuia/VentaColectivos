import express from "express";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";

export const cuentasRouter = express.Router();

cuentasRouter
  .post(
    "/",
    body("usuario").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body("idvendedor").isInt({ min: 1 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }
      const { usuario, password, idvendedor } = req.body;
      const passwordHashed = await bcrypt.hash(password, 8);
      const [rows] = await db.execute(
        "INSERT INTO cuentas (usuario, password, idvendedor) VALUES (?, ?, ?)",
        [usuario, passwordHashed, idvendedor]
      );
      res.status(201).send({ id: rows.insertId, usuario, idvendedor });
    }
  )

  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute(
      "SELECT idcuenta, usuario, idvendedor FROM cuentas"
    );
    res.send(rows);
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT idcuenta, usuario, idvendedor FROM cuentas WHERE idcuenta = ?",
      [id]
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Cuenta no encontrada" });
    }
  })

  .get("/:id/vendedor", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT v.idvendedor, v.nombre, v.apellido \
      FROM vendedores v \
      JOIN cuentas c ON v.idvendedor = c.idvendedor \
      WHERE c.idcuenta = ?",
      [id]
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Vendedor no encontrado" });
    }
  })

  .delete("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM cuentas WHERE idcuenta = ?", [id]);
    res.send("ok");
  });
