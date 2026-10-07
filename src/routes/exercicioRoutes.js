const express = require('express');
const router = express.Router();
const { criarExercicio, listarExercicios, deletarExercicio } = require('../controllers/exercicioController');

router.post('/', criarExercicio);
router.get('/', listarExercicios);
router.delete('/:id', deletarExercicio);

module.exports = router;