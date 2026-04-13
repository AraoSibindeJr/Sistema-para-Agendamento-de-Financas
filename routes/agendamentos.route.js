import Router from "express";
import AgendamentoController from"../controllers/agendamento.controller.js";


const agendamentoRouter = Router();

const controller = new AgendamentoController();

agendamentoRouter.post("/criar", controller.criarAgendamento);

agendamentoRouter.put("/cancelar", controller.cancelarAgendamento);

agendamentoRouter.get("/listar", controller.listarAgendamentos);

agendamentoRouter.get("/listar-status", controller.listarAgendamentosPostStatus);

export { agendamentoRouter };