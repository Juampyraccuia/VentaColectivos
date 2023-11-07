import express from "express";
import { db } from "./db.js";
export const ventasRouter = express.Router();

ventasRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM ventacolectivos.ventas");
    res.send(rows);
})
    .get("/:id", async (req, res) => {

        const id = req.params.id;

        const [rows, fields] = await db.execute(
            "SELECT * FROM ventacolectivos.ventas WHERE idventa = :id",
            { id }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Venta no encontrada" });
        }
    })

    .get("/:id/pasajeros", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            `SELECT p.idpasajero, p.nombres, p.apellidos, p.dni FROM ventacolectivos.pasajeros p 
            JOIN ventacolectivos.ventas v ON p.idpasajero = v.idpasajero WHERE v.idventa = :id`,
            { id }
        );
        res.send(rows);
    })

    .get("/:id/asientos", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            `SELECT a.id, a.numero, a.estado, c.idcolectivo, c.butacaNumero, c.capacidad, c.fechahorario 
            FROM ventacolectivos.asientos a JOIN ventacolectivos.colectivos c ON a.colectivos_idColectivos =
            c.idcolectivo JOIN ventacolectivos.ventas v ON c.idcolectivo = v.colectivos_idcolectivo WHERE v.idventa = :id`,
            { id }
        );
        res.send(rows);
    });