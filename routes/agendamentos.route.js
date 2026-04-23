import Router from "express";
import { AgendamentoController } from '../controllers/agendamento.contoller.js';


const agendamentoRouter = Router();

const controller = new AgendamentoController();

agendamentoRouter.post("/criar", controller.criarAgendamento);

agendamentoRouter.put("/cancelar", controller.cancelarAgendamento);

agendamentoRouter.get("/listar/:userId", controller.listaPorUserId);

agendamentoRouter.get("/listar-status", controller.listarAgendamentosPostStatus);

export { agendamentoRouter };