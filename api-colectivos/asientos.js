import express from "express";
import { db } from "./db.js";


export const asientosRouter=express.Router()

    asientosRouter.get("/", async(req,res)=>{
        cosnt [rows,fields]=await db.execute(
            "SELECT id, numero, estado FROM asiento"
        );
        res.send(rows)
    })

    asientosRouter.get("/:id", async(req,res)=>{
        const id= req.params.id;
        const[rows, fields]=await db.execute(
            "SELECT id, numero, estado FROM asientos",
            {id}
        );
        if (rows.length>0) {
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