const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  carregarDados();

  document.getElementById('form-exercicio').addEventListener('submit', criarExercicio);
  document.getElementById('form-treino').addEventListener('submit', criarTreino);
  document.getElementById('form-associar').addEventListener('submit', associarExercicio);
});

async function carregarDados() {
  await carregarTreinos();
  await carregarSelects();
}

async function carregarTreinos() {
  const res = await fetch(`${API_URL}/treinos`);
  const treinos = await res.json();
  const container = document.getElementById('lista-treinos');
  container.innerHTML = '';

  if (treinos.length === 0) {
    container.innerHTML = '<p>Nenhum treino registado ainda.</p>';
    return;
  }

  treinos.forEach(t => {
    const div = document.createElement('div');
    div.className = 'treino-item';
    
    let exerciciosHtml = t.exercicios.length > 0 
      ? t.exercicios.map(e => `<li>${e.exercicio.nome} (${e.exercicio.grupoMuscular})</li>`).join('')
      : '<li>Nenhum exercício associado</li>';

    div.innerHTML = `
      <div class="treino-header">
        <h3>${t.nome} - <small>${t.objetivo}</small></h3>
        <button class="btn-delete" onclick="deletarTreino(${t.id})">Apagar Treino</button>
      </div>
      <ul>${exerciciosHtml}</ul>
    `;
    container.appendChild(div);
  });
}

async function carregarSelects() {
  const resTreinos = await fetch(`${API_URL}/treinos`);
  const treinos = await resTreinos.json();

  const resExercicios = await fetch(`${API_URL}/exercicios`);
  const exercicios = await resExercicios.json();

  const selectTreino = document.getElementById('select-treino');
  const selectExercicio = document.getElementById('select-exercicio');

  selectTreino.innerHTML = '<option value="">Selecione o Treino</option>';
  selectExercicio.innerHTML = '<option value="">Selecione o Exercício</option>';

  treinos.forEach(t => selectTreino.innerHTML += `<option value="${t.id}">${t.nome}</option>`);
  exercicios.forEach(e => selectExercicio.innerHTML += `<option value="${e.id}">${e.nome}</option>`);
}

async function criarExercicio(e) {
  e.preventDefault();
  const nome = document.getElementById('nome-exercicio').value;
  const grupoMuscular = document.getElementById('grupo-muscular').value;

  await fetch(`${API_URL}/exercicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, grupoMuscular })
  });

  e.target.reset();
  carregarDados();
}

async function criarTreino(e) {
  e.preventDefault();
  const nome = document.getElementById('nome-treino').value;
  const objetivo = document.getElementById('objetivo-treino').value;

  await fetch(`${API_URL}/treinos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, objetivo })
  });

  e.target.reset();
  carregarDados();
}

async function associarExercicio(e) {
  e.preventDefault();
  const treinoId = document.getElementById('select-treino').value;
  const exercicioId = document.getElementById('select-exercicio').value;

  await fetch(`${API_URL}/treinos/exercicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ treinoId, exercicioId })
  });

  e.target.reset();
  carregarDados();
}

async function deletarTreino(id) {
  if (confirm('Tem certeza que deseja apagar este treino?')) {
    await fetch(`${API_URL}/treinos/${id}`, { method: 'DELETE' });
    carregarDados();
  }
}