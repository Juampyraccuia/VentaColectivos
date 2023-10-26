import express from "express";
import { db } from "./db.js";

export const boletosRouter=express
.Router()
boletosRouter.get("/",async(req,res)=>{
    const [rows, fields]=await db.execute(
        "SELECT * FROM ventacolectivos.boletos"
    );
    res.send(rows)
});

boletosRouter.get("/:id", async(req,res)=>{
    const id= req.params.id;
    const [rows,fields]= await db.execute(
        "SELECT id, destino, colectivo FROM boletos",
        {id}
    );
    if (rows.length>0){
        res.send(rows[0])
    }else{
        res.status(404).send({mensaje:"boleto no encontrado"})
    }
})