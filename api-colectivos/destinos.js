import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";

export const destinosRouter = express.Router();

destinosRouter.get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM destinos");
    res.send(rows);
})
    .get("/:nombre", async (req, res) => {
        const nombre = req.params.nombre;
        const [rows, fields] = await db.execute(
            "SELECT * FROM destinos WHERE destino = :nombre",
            { nombre }
        );
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })


    .post("/", 
    body("destino.valor").isNumeric().isLength({min:1, max:8}),
    body("destino.destino").isAlpha().isLength({min:1, max:45}),
    async(req,res)=>{
        const validacion=validationResult(req);
        if(!validacion.isEmpty()){
            res.status(400).send({errors:validacion.array()});
            return;
        }
        const destino = req.body.destino;
        const [rows]= await db.execute(
            'INSERT INTO ventacolectivos.destinos (valor, Destino) VALUES (?,?)',
            [destino.valor, destino.destino]
        );
        res.status(201).send({valor:destino.valor, destino:destino.destino, id: rows.insertId});
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
            "UPDATE ventacolectivos.destinos SET valor = :valor WHERE destino = :nombre",
            
            { valor: nuevoDestino.valor, nombre }
        );

        if (result.affectedRows > 0) {
            res.status(200).send({ mensaje: "Destino actualizado correctamente" });
        } else {
            res.status(404).send({ mensaje: "Destino no encontrado" });
        }
    })

