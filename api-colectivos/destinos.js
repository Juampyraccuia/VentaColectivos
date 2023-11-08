import express from "express";
import { db } from "./db.js";

export const destinosRouter = express.Router();

destinosRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM destinos");
    res.send(rows);
})
    .get("/:nombre", async (req, res) => {
        const nombre = req.params.nombre;
        const [rows, fields] = await db.execute(
            "SELECT idDestinos, valor, destino FROM destinos WHERE destino = :nombre",
            { nombre }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })


    .post("/", async (req, res) => {
        const destino = req.body;
        if (destino.valor === undefined || destino.destino === undefined) {
            return res.status(400).send({ mensaje: "Los campos valor y destino son requeridos." });
        }
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
    })

    .delete("/:nombre", async (req, res) => {
        const nombre = req.params.nombre;
        const [result] = await db.execute(
            "DELETE FROM destinos WHERE destino = :nombre",
            { nombre }
        );
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })

    .put("/:nombre", async (req, res) => {
        const nombre = req.params.nombre;
        const nuevoDestino = req.body;

        const [result] = await db.execute(
            "UPDATE destinos SET valor = :valor WHERE destino = :nombre",
            { valor: nuevoDestino.valor, nombre }
        );

        if (result.affectedRows > 0) {
            res.status(200).send({ mensaje: "Destino actualizado correctamente" });
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })

