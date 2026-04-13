import mongoose from "mongoose";


const agendamentoSchema = new mongoose.Schema({
    userId: { type: String},
    dataAgendamento: { type: Date},
    horarioAgendamento: { type: String},
    status: { type: String}
});

const agendamentoModel = mongoose.model("agendamento", agendamentoSchema);

export { agendamentoModel };