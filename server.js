import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import { conectarBD } from './config/db.js';
import  { agendamentoRouter } from './routes/agendamentos.route.js';

dotenv.config();
conectarBD();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", agendamentoRouter)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});