import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";


export const asientosRouter = express.Router();

asientosRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.asientos");
    res.send(rows);
})
    .get("/:id", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            "SELECT * FROM ventacolectivos.asientos WHERE id = :id",
            { id }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Asiento no encontrado" });
        }
    })
    .get("/:id/asiento", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            `SELECT a.id, a.numero, a.estado, c.id AS colectivoId, c.butacaNumero, c.capacidad, 
            c.fechahorario FROM asientos a JOIN colectivos c ON a.colectivos_idColectivos = c.id WHERE a.id = :id`,
            { id }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Asiento no encontrado" });
        }
    });
    

    asientosRouter.post("/",
  body("asiento.numero").isNumeric().isLength({min:1, max:2}),
  body("asiento.estado").isAlpha().isLength({min:1, max:2}),
//   body("asiento.idColectivo").isNumeric().isLength({min:1, max:2}),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({errors: validacion.array()});
      return;
    }
    const asiento = req.body.asiento;
    
    const [rows] = await db.execute(
      "SELECT * FROM ventacolectivos.asiento WHERE numero = ? AND estado = reservado",
      [asiento.numero, asiento.estado]
    );
    if (rows.length > 0) {
      
      res.status(200).send("El asiento está ocupado.");
      return;
    }
    
    await db.execute(
      "INSERT INTO ventacolectivos.asiento (numero, estado, idColectivo) VALUES (?, ?, ?)",
      [asiento.numero, asiento.estado, asiento.idColectivo]
    );
    res.status(200).send("El asiento ha sido reservado correctamente.");
  }
)