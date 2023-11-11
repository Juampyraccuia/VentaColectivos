import express from "express";
import { db } from "./db.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

export const vendedorRouter = express.Router();

vendedorRouter.get("/", async (req, res) => {
  const [rows, fields] = await db.execute(
    "SELECT * FROM ventacolectivos.vendedor"
  );
  res.send(rows);
})


  .get("/ventas", async (req, res) => {
    const [rows, fields] = await db.execute(
      `SELECT vendedor.nombre, SUM(ventas.montoTotal) AS total_de_ventas FROM ventacolectivos.vendedor 
    JOIN ventacolectivos.ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor GROUP BY vendedor.nombre`
    );
    res.send(rows);
  })
  .get("/:nombre", async (req, res) => {
    const nombre = req.params.nombre;
    const [rows, fields] = await db.execute(
      `SELECT vendedor.idvendedor, ventas.idventa, SUM(ventas.montoTotal) AS total_de_ventas FROM ventacolectivos.vendedor
      JOIN ventacolectivos.ventas ON vendedor.idvendedor = ventas.vendedor_idVendedor WHERE vendedor.nombre = :nombre
      GROUP BY vendedor.idvendedor, ventas.idventa`,
      { nombre }
    );
    res.send(rows);
  })


//   .post(
//     "/", 
//     body,("usuario").isAlpha(),
//     body("password").isStrongPassword({
//       minLength:8,
//       minLowercase:1,
//       minUppercase:1,
//       minNumbers:1,
//       minSymbols:0
//     }),
//     body("idVendedor").isInt({min:1}),
//     async (req,res)=>{;
//       const validacion=validationResult(req);
//       if(!validacion.isEmpty()) {
//       res.status(400).send({errores:validacion.array()});
//       return
//     }
//     const {usuario,password,idVendedor}=req.body;
//     const passwordHashed=await bcrypt.hash(password, 8);
//     const rows= await db.execute(
//       "INSERT INTO ventacolectivos.vendedores(usuario, password, persona_id) VALUES (:usuario, :password, :idVendedor)",
//       {usuario,password:passwordHashed,idVendedor}
//     )
//     res.status(201).send({id:rows.insertId,usuario,idVendedor})
//   }
// ) 


  .post("/",
  body("vendedor.nombre").isAlpha().isLength({min:1, max:45}),
  body("vendedor.apellido").isAlpha().isLength({min:1 , max:45}),
   async (req, res) => {
    const validacion=validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({errors:validacion.array()});
      return;
    }
    const vendedor = req.body.vendedor;
    const [rows] = await db.execute(
      "INSERT INTO ventacolectivos.vendedor (nombre, apellido) VALUES (?, ?)",
      [vendedor.nombre, vendedor.apellido]
    );

    res.status(201).send({ nombre:vendedor.nombre, apellido: vendedor.apellido, idvendedor: rows.insertId });
  })


  .delete("/:idvendedor", async (req, res) => {
    const idVendedor = req.params.idvendedor;
    const [result] = await db.execute(
      "DELETE FROM ventacolectivos.vendedor WHERE idvendedor = :idvendedor",
      { idVendedor }
    );
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send({ mensaje: "Vendedor no encontrado" });
    }
  })
