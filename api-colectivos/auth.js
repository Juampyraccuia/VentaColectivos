import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { db } from "./db.js";

export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      const [rows, fields] = await db.execute(
        "SELECT usuario, rol FROM cuentas WHERE usuario = :usuario",
        { usuario: payload.usuario }
      );
      if (rows.length > 0) {
        next(null, rows[0]);
      } else {
        next(null, false);
      }
    })
  );
}

export const authRouter = express
  .Router()

  .post(
    "/login",
    body("usuario").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { usuario, password } = req.body;

      // Obtener cuenta de usuario
      const [rows, fields] = await db.execute(
        `SELECT
           c.usuario,
           c.password,
           c.rol
         FROM cuentas c
         WHERE usuario = :usuario`,
        { usuario }
      );

      if (rows.length === 0) {
        res.status(400).send("Usuario o contraseña inválida");
        return;
      }

      const user = rows[0];

      // Verificar contraseña
      const passwordCompared = await bcrypt.compare(password, user.password);
      if (!passwordCompared) {
        res.status(400).send("Usuario o contraseña inválida");
        return;
      }

      // Generar token
      const payload = { usuario };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7D",
      });

      // Sesión en WEB
      const sesion = {
        usuario: user.usuario,
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
