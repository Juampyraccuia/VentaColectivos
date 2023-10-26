import  express  from "express"
import { db } from "./db.js"

export const destinosRouter = express
.Router()
    destinosRouter.get("/",async(req,res)=>{
        const [rows, fields]=await db.execute(
            "SELECT * FROM ventacolectivos.boletos"
        );
        res.send(rows)
    });
    

    destinosRouter.get("./:id", async (req, res) => {
        const id = req.params.id;
        const [rows, fields] = await db.execute(
            "SELECT id, valor, destino FROM destino",
            { id }
        );
        if (rows.length > 0) {
            res.send(rows[0])
        } else {
            res.status(404).send({ mensaje: "destino no encontrado" })
        }
    })

// .get("/:id/destino",async(req,res)=>{
//     const id=req.params.id;
//     const [rows,fields]=await db.execute
// })