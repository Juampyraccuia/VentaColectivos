import express from "express";
import { db } from "./db.js";

export const boletosRouter=express
boletosRouter.get("/",async(req,res)=>{
    const [rows, fields]=await db.execute(
        "SELECT id, destino, colectivo FROM boletos"
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