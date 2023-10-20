import express from "express";
import { db } from "./db.js";

export const  ventasRouter= express.Router()
    ventasRouter.get("/", async(req,res)=>{
        const [rows,fields]=await db.execute("SELECT *FROM ventas");
        res.send(rows);
    });

    ventasRouter .get("/:id", async(req,res)=>{
        const id=req.params.id;
        const [rows, fields]=await db.execute(
            "SELECT * FROM ventas WHERE id=:id",
            {id}
        )
        if(rows.length>0){
            res.send(rows[0]);
        }else{
            res.status(404).send({mensaje:"venta no encontrada"})
        }
    });

ventasRouter .get("/:id/pasajeros", async(req,res)=>{
    const id=req.params.id;
    const[rows, fields]=await db.execute(
        "SELECT id, id_pasajero AS pasajeroId FROM pasajeros WHERE pasajeros_id=:id ",
        {id}
    );
});

ventasRouter.get("/:id/asientos", async(req,res)=>{
    const id=req.params.id;
    const[rows, fields]= await db.execute(
        "SELECT a.id, a.nombre, "
    )
})