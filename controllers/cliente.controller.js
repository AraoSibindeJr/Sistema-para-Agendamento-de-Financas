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

    login = async (req, res) => {
        const { email } = req.body;

        const saved = await clienteModel.find({email});

        const { _id } = saved;

        res.status(200).json({ 
            message: "Login effectuado com sucesso!",
            data: _id
        })
    }
}

export default ClienteController;