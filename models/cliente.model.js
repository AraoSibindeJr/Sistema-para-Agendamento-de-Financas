import mongoose from "mongoose";


const clienteSchema = mongoose.Schema({
    nomeCompleto: { type: String, required: true},
    nuit: { type: String, required: true},
    identif: { type: String, required: true},
    dataNascimento: { type: String },
    nrTelefone: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const clienteModel = mongoose.model("cliente", clienteSchema);

export { clienteModel };