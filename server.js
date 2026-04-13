import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import conectarBD from './config/db.js';
import  { agendamentoRouter } from './routes/agendamentos.route.js';

// Carrega as variáveis do ficheiro .env
dotenv.config();

// Conecta à base de dados
conectarBD();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste — confirma que o servidor está vivo
app.get('/', (req, res) => {
  res.json({ mensagem: '✅ Servidor FinAgenda está online!' });
});

app.use("/api/v1", agendamentoRouter)

// Rotas da API (vamos adicionar a seguir)
// app.use('/api/auth',         require('./routes/auth'));
// app.use('/api/agendamentos', require('./routes/agendamentos'));

// Arranca o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});