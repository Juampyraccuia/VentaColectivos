import express from "express";
import { db } from "./db.js";


export const asientosRouter=express.Router()

    .get("/", async(req,res)=>{
        cosnt [rows,fields]=await db.execute(
            "SELECT id, numero, estado FROM asiento"
        );
        res.send(rows)
    })

    .get("/:id", async(req,res)=>{
        const id= req.params.id;
        const[rows, fields]=await db.execute(
            "SELECT id, numero, estado FROM asientos",
            {id}
        );
        if (rows.lengt>0) {
            res.send(rows[0])
        }else{
            res.status(404).send({mensaje:"asiento no encontrado"})
        }
    })
    .get("/:id/asiento",async(req,res)=>{
        const id=req.params.id;
        const [rows,fields]=await db.execute(
            "SELECT a.id, a.numero, a.estado \FROM asientos a\ JOIN"
        )
    })