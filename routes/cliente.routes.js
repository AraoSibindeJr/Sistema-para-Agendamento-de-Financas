import { Router } from "express";
import ClienteController from "../controllers/cliente.controller.js";


const clienteRoutes = Router();

const controller = new ClienteController();

clienteRoutes.post("/cadastrar", controller.cadastrar);

export { clienteRoutes };