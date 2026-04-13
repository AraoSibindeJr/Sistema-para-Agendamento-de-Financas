import mongoose from "mongoose";

const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Base de dados conectada com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar à base de dados:', erro.message);
    process.exit(1);
  }
};

export {conectarBD};