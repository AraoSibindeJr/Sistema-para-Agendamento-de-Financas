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

// ==== AUTH ADDED ====
const jwt = require('jsonwebtoken');
const SECRET = 'secret123';

let users = []; // simple in-memory (replace with DB)

// register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if(users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User exists' });
  }
  users.push({ username, password });
  res.json({ message: 'Registered' });
});

// login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// middleware
function auth(req, res, next){
  const token = req.headers.authorization;
  if(!token) return res.sendStatus(403);
  try{
    req.user = jwt.verify(token, SECRET);
    next();
  }catch(e){
    res.sendStatus(403);
  }
}
// ==== END AUTH ====
