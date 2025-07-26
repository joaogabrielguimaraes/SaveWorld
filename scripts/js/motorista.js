document.addEventListener('DOMContentLoaded', carregarColetas);

document.querySelectorAll('.filters select, .filters input').forEach(filtro => {
    filtro.addEventListener('change', carregarColetas);
});

function limparFiltro(filtroId) {
    document.getElementById(filtroId).value = ''; 
    carregarColetas();
}

function carregarColetas() {
    const bairro = document.getElementById('filtro-bairro').value;
    const material = document.getElementById('filtro-material').value;
    const data = document.getElementById('filtro-data').value;

    const params = new URLSearchParams({ bairro, material, data });

    fetch(`../scripts/php/motoristaColeta.php?${params.toString()}`)
        .then(res => res.json())
        .then(coletas => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';

            if (!coletas.length) {
                tbody.innerHTML = '<tr><td colspan="6">Nenhuma coleta encontrada.</td></tr>';
                return;
            }

            coletas.forEach(coleta => {
                const tr = document.createElement('tr');
                tr.onclick = () => mostrarDetalhes(coleta.id);

                const status = coleta.concluido === 'Sim' ? 'Concluída' : 'Pendente';

                tr.innerHTML = `
                    <td>${coleta.id}</td>
                    <td>${coleta.data_coleta}</td>
                    <td>${coleta.bairro}</td>
                    <td>${coleta.tipo_coleta}</td>
                    <td>${status}</td>
                    <td>
                        ${coleta.concluido === 'Não' ? `<button class="btn btn-concluir" onclick="marcarConcluido(${coleta.id}, event)">Concluir</button>` : ''}
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error('Erro ao buscar coletas:', err);
        });
}


function mostrarDetalhes(id) {
    fetch(`../scripts/php/buscarDetMotorista.php?id=${id}`)
        .then(res => res.json())
        .then(dados => {
            if (dados.erro) {
                alert('Erro: ' + dados.erro);
                return;
            }

            const conteudo = `
                <p><strong>ID:</strong> ${dados.id}</p>
                <p><strong>Data da Coleta:</strong> ${dados.data_coleta}</p>
                <p><strong>Horário:</strong> ${dados.horario_coleta}</p>
                <p><strong>Bairro:</strong> ${dados.bairro}</p>
                <p><strong>Endereço:</strong> ${dados.rua}, ${dados.numero}</p>
                <p><strong>CEP:</strong> ${dados.cep}</p>
                <p><strong>Cidade:</strong> ${dados.cidade} - ${dados.estado}</p>
                <p><strong>Tipo de Coleta:</strong> ${dados.tipo_coleta}</p>
                <p><strong>Observações:</strong> ${dados.observacao_coleta}</p>
                <p><strong>Registrado em:</strong> ${dados.created_at}</p>
            `;

            document.getElementById('detalhes-conteudo').innerHTML = conteudo;
            document.getElementById('modal-detalhes').style.display = 'block';
        })
        .catch(err => {
            console.error('Erro ao buscar detalhes:', err);
        });
}

function fecharModal() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('clear-bairro').addEventListener('click', function() {
    limparFiltro('filtro-bairro');
});

document.getElementById('clear-material').addEventListener('click', function() {
    limparFiltro('filtro-material');
});

document.getElementById('clear-data').addEventListener('click', function() {
    limparFiltro('filtro-data');
});

function marcarConcluido(id, event) {
    event.stopPropagation();

    if (confirm(`Marcar coleta ${id} como concluída?`)) {
        fetch('../scripts/php/marcarConclusao.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                alert('Coleta concluída!');
                carregarColetas(); 
            } else {
                alert(data.erro || 'Erro ao concluir.');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('../scripts/php/carregarBairro.php')
        .then(response => response.json())
        .then(bairros => {
            const selectBairro = document.getElementById('filtro-bairro');
            bairros.forEach(bairro => {
                const option = document.createElement('option');
                option.value = bairro;
                option.textContent = bairro;
                selectBairro.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar bairros:', error));
});

document.getElementById('clear-bairro').addEventListener('click', function() {
    document.getElementById('filtro-bairro').value = '';
    carregarColetas();
});
