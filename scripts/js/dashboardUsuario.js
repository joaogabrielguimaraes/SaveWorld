document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
  carregarGraficoMateriais();
});

async function carregarDashboard() {
  try {
    const response = await fetch('../scripts/php/dados_dashboardUsuario.php');
    if (!response.ok) throw new Error('Erro ao buscar dados do dashboard');

    const data = await response.json();
    preencherContadores(data.stats);
    preencherTabela(data.coletas);
    animarNumeros();
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }
}

function preencherContadores(stats) {
  const setTexto = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };

  setTexto('concluidas', stats.concluidas);
  setTexto('emAndamento', stats.em_andamento);
  setTexto('totalColetas', stats.total_coletas);
}

function preencherTabela(coletas) {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  coletas.forEach(({ data, local, material, status }) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${data}</td>
      <td>${local}</td>
      <td><span class="text">${material}</span></td>
      <td><span class="badge ${status === 'Concluído' ? 'bg-success' : 'bg-warning'}">${status}</span></td>
    `;
    tbody.appendChild(linha);
  });
}

async function carregarGraficoMateriais() {
  try {
    const res = await fetch('../scripts/php/carregarTipoUsuario.php');
    if (!res.ok) throw new Error('Erro na resposta do servidor');

    const data = await res.json();
    console.log('Dados recebidos do PHP:', data);

    const ctx = document.getElementById('materiaisChart')?.getContext('2d');
    if (!ctx) return console.error('Canvas não encontrado');

    new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.valores,
                        backgroundColor: [
                            '#2ecc71',
                            '#3498db',
                            '#f1c40f',
                            '#e74c3c',
                            '#9b59b6',
                            '#1abc9c'
                        ],
                        borderWidth: 0,
                    }]
                },
            });
    } catch (err) {
        console.error('Erro ao buscar dados para o gráfico:', err);
    }
}
