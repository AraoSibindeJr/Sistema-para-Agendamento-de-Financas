import { agendamentoModel } from "../models/agendamendo.model.js";



class ClienteController {


    criarAgendamento = async (req, res) => {

        const { 
            nomeCompleto,
            nuit,
            identif,
            dataNascimento,
            nrTelefone,
            email
        } = req.body;


        const newCliente = new agendamentoModel({
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

        await newCliente.save().then(() => console.log("Cliente cadastrado com sucesso!"));

        res.status(201).json({
            message: "Cadastro concluido!",
            data: newCliente 
        });

    }
}

export default ClienteController;