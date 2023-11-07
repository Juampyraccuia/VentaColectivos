import express from "express";
import { db } from "./db.js";


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