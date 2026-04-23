import { agendamentoModel } from "../models/agendamendo.model.js";



class AgendamentoController {


    criarAgendamento = async (req, res) => {

        const { 
            nomeCompleto,
            nuit,
            identif,
            dataNascimento,
            nrTelefone,
            email,
            dataAg,
            horarioAgendamento
        } = req.body;


        const newAgendamento = new agendamentoModel({
            nomeCompleto,
            nuit,
            identif,
            dataNascimento,
            nrTelefone,
            email,
            dataAg,
            horarioAgendamento,
            status: "ativo"
        });

        console.log(newAgendamento)

        await newAgendamento.save().then(() => console.log("Agendamento marcado com sucesso!"));

        console.log(res.body)
        res.status(201).json({
            message: "Agendamento concluido!",
            data: newAgendamento 
        });

    }

    cancelarAgendamento = async (req, res) => {
        const { id } = req.body;

        const saved = await agendamentoModel.findById(id);

        if(!saved){
            return res.status(404).json({
                message: `Agendamento com id: ${id} não encontrado!`
            });
        }

        await agendamentoModel.findByIdAndUpdate(id, { status: "desativado "});

        return res.status(200).json({
            message: "Agendamento cancelado com sucesso!"
        });
    }

    listarAgendamentos = async (req, res) => {
        const { identif } = req.body

        const agendamentos = await agendamentoModel.find({ identif});

        res.status(200).json({
            message: `Agendamentos do user: ${identif}.`,
            data: agendamentos
        })
    }

    listarAgendamentosPostStatus = async (req, res) => {

        const { identif, status} = req.query;

        const agendamentos = await agendamentoModel.find({
            identif, status: status
        });

        res.status(200).json({
            message: `Agendamentos do user: ${identif}, com status: ${status}`,
            data: agendamentos
        })
    }
}

export default AgendamentoController;