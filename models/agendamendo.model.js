import mongoose from "mongoose";


const agendamentoSchema = new mongoose.Schema({
    nomeCompleto: { type: String, required: true},
    nuit: { type: String, required: true},
    identif: { type: String, required: true},
    dataNascimento: { type: String },
    nrTelefone: { type: String, required: true },
    email: { type: String, required: true },
    dataAgendamento: { type: Date},
    horarioAgendamento: { type: String},
    status: { type: String}
});

const agendamentoModel = mongoose.model("agendamento", agendamentoSchema);

export { agendamentoModel };