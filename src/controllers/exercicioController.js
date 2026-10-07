const prisma = require('../database');

const criarExercicio = async (req, res) => {
  try {
    const { nome, grupoMuscular } = req.body;
    if (!nome || !grupoMuscular) {
      return res.status(400).json({ erro: 'Nome e grupo muscular são obrigatórios.' });
    }

    const novoExercicio = await prisma.exercicio.create({
      data: { nome, grupoMuscular }
    });

    return res.status(201).json(novoExercicio);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar exercício.', detalhe: error.message });
  }
};

const listarExercicios = async (req, res) => {
  try {
    const exercicios = await prisma.exercicio.findMany();
    return res.status(200).json(exercicios);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar exercícios.', detalhe: error.message });
  }
};

const deletarExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicioId = Number(id);

    // Apaga primeiro as ligações da tabela N:N
    await prisma.treinoExercicio.deleteMany({
      where: { exercicioId }
    });

    // Apaga o exercício
    await prisma.exercicio.delete({
      where: { id: exercicioId }
    });

    return res.status(200).json({ mensagem: 'Exercício eliminado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao eliminar exercício.', detalhe: error.message });
  }
};

module.exports = {
  criarExercicio,
  listarExercicios,
  deletarExercicio
};