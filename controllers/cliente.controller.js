import { clienteModel } from "../models/cliente.model.js";

class ClienteController {


    cadastrar = async (req, res) => {

        const { 
            nomeCompleto,
            nuit,
            identif,
            dataNascimento,
            nrTelefone,
            email
        } = req.body;


        const newCliente = new clienteModel({
            nomeCompleto,
            nuit,
            identif,
            dataNascimento,
            nrTelefone,
            email
        });

        await newCliente.save().then(() => console.log("Cliente cadastrado com sucesso!"));

        res.status(201).json({
            message: "Cadastro concluido!",
            data: newCliente 
        });

    }
}

export default ClienteController;