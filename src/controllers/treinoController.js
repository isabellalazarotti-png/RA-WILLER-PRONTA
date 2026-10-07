const prisma = require('../database');

const criarTreino = async (req, res) => {
  try {
    const { nome, objetivo } = req.body;
    if (!nome || !objetivo) {
      return res.status(400).json({ erro: 'Nome e objetivo são obrigatórios.' });
    }

    const novoTreino = await prisma.treino.create({
      data: { nome, objetivo }
    });

    return res.status(201).json(novoTreino);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar treino.', detalhe: error.message });
  }
};

const listarTreinos = async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      include: {
        exercicios: {
          include: {
            exercicio: true
          }
        }
      }
    });
    return res.status(200).json(treinos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar treinos.', detalhe: error.message });
  }
};

const adicionarExercicioAoTreino = async (req, res) => {
  try {
    const { treinoId, exercicioId } = req.body;

    if (!treinoId || !exercicioId) {
      return res.status(400).json({ erro: 'treinoId e exercicioId são obrigatórios.' });
    }

    const associacao = await prisma.treinoExercicio.create({
      data: {
        treinoId: Number(treinoId),
        exercicioId: Number(exercicioId)
      }
    });

    return res.status(201).json({ mensagem: 'Exercício associado ao treino com sucesso!', associacao });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ erro: 'Este exercício já está associado a este treino.' });
    }
    return res.status(500).json({ erro: 'Erro ao associar exercício ao treino.', detalhe: error.message });
  }
};

const deletarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const treinoId = Number(id);

    // Apaga primeiro as ligações da tabela N:N
    await prisma.treinoExercicio.deleteMany({
      where: { treinoId }
    });

    // Apaga o treino
    await prisma.treino.delete({
      where: { id: treinoId }
    });

    return res.status(200).json({ mensagem: 'Treino eliminado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao eliminar treino.', detalhe: error.message });
  }
};

module.exports = {
  criarTreino,
  listarTreinos,
  adicionarExercicioAoTreino,
  deletarTreino
};