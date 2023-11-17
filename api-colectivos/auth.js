import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { db } from "./db.js";


export function authConfig(){
    const jwtFromRequest={
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };
    passport.use(
        new Strategy(jwtOptions, async(payload, next)=>{
            const[rows, fields]= await db.execute(
                "SELECT FROM ventacolectivos.vendedores WHERE usuario =:usuario",
                {usuario: payload.usuario}
            );
            if (rows.length > 0){
                next(null, rows[0]);
            }else{
                next(null, false);
            }
            
        })
    )
}
export const authRouter=express
.Router()
    .post(
        "/login",
    body("usuario").isAlphanumeric().isLength({min:1 , max:25}),
    body("passsword").isStrongPassword({
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1,
       }),
       async (req, res)=>{
        const validacion=validationResult(req);
        if (!validacion.isEmpty()){
            res.status(400).send({errors:validacion.array()});
            return;
        }
        const {usuario,password} = req.body;
        
        const[rows, fields]= await db.execute(
            "SELECT * FROM ventacolectivos.vendedores WHERE usuario = :usuario",
            {usuario}
        );
        if (rows.length === 0){
            res.status(400).send("Usuario o contraseña invalidad");
            return;
        }
        const user= rows[0];

        const passswordCompared = await bcrypt.compare(password, user.password);
        if(!passswordCompared) {
            res.status(400).send("Usuario o contraseña invalida");
            return;
        }
        //crear token
        const payload= {usuario};
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
            expiresIn:"12h",
    });

    const sesion = {
        usuario: user.usuario,
        personaId: user.personaId,
        rol: user.rol,
        token,
      };

      res.send(sesion);
    }
  )
  .get(
    "/perfil",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json(req.user);
    }
  );
