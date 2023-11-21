import "dotenv/config";
import  express  from "express";
import cors from "cors"
import { asientosRouter } from "./asientos.js";
import { vendedoresRouter } from "./vendedores.js";
import { pasajerosRouter } from "./pasajeros.js";
import { destinosRouter } from "./destinos.js";
import { ventasRouter } from "./ventas.js";
import { boletosRouter } from "./boletos.js";
import { colectivosRouter } from "./colectivos.js";
import { authConfig, authRouter } from "./auth.js";

const app = express();
app.use(express.json());
app.use(cors());
authConfig()

app.use("/asientos", asientosRouter);
app.use("/vendedores",vendedoresRouter);
app.use("/pasajeros",pasajerosRouter)
app.use("/destinos",destinosRouter)
app.use("/ventas",ventasRouter)
app.use("/boletos",boletosRouter)
app.use("/colectivos", colectivosRouter)


app.get('/', (req,res)=>{
    res.send('hola soy una api')
})
app.listen(3000,()=>{
    console.log('API en funcionamiento');
})