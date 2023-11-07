import express from "express";
import { db } from "./db.js";

export const destinosRouter = express.Router();

destinosRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM destinos");
    res.send(rows);
})
    .get("/:id", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            "SELECT id, valor, destino FROM destinos WHERE id = :id",
            { id }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })

    .post("/", async (req, res) => {
        const destino = req.body;
        const [result] = await db.execute(
            "INSERT INTO destinos (valor, destino) VALUES (?, ?)",
            [destino.valor, destino.destino]
        );
        const nuevoDestino = {
            id: result.insertId,
            valor: destino.valor,
            destino: destino.destino
        };
        res.status(201).send(nuevoDestino);
    });