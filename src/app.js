const express = require('express');
const treinoRoutes = require('./routes/treinoRoutes');
const exercicioRoutes = require('./routes/exercicioRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public')); // Servir o front-end estático

app.use('/treinos', treinoRoutes);
app.use('/exercicios', exercicioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});