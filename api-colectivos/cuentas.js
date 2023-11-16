import express from "express";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";


export const cuentasRouter = express
  .Router()

  .post(
    "/",
    body("usuario").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body("idVendedor").isInt({min:1}),
    async(req,res)=>{
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors: validacion.array()});
            return
    }const {usuario,password , idVendedor}=req.body;
    const passwordHashed= await bcrypt.hash(password,8)
    const [rows]=await db.execute(
        "INSERT INTO cuentas (usuario, password, idVendedo)VALUES (:usuariom ,:password,:idVendedor)",
        { usuario, password: passwordHashed, idVendedor }
    );
    res.status(201).send({id:rows.insertId, usuario, idVendedor});
    })

