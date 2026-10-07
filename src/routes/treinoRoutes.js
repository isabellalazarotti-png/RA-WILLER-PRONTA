const express = require('express');
const router = express.Router();
const { criarTreino, listarTreinos, adicionarExercicioAoTreino, deletarTreino } = require('../controllers/treinoController');

router.post('/', criarTreino);
router.get('/', listarTreinos);
router.post('/exercicios', adicionarExercicioAoTreino);
router.delete('/:id', deletarTreino);

module.exports = router;