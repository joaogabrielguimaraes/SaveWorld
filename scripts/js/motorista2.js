document.addEventListener('DOMContentLoaded', () => {
    carregarBairros();
    carregarColetas();
    configurarEventosDeFiltro();
    configurarBotoesLimpar();
});

function carregarColetas() {
    const bairro = document.getElementById('filtro-bairro').value;
    const material = document.getElementById('filtro-material').value;
    const data = document.getElementById('filtro-data').value;

    const params = new URLSearchParams();
    if (bairro) params.append('bairro', bairro);
    if (material) params.append('material', material);
    if (data) params.append('data', data);

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
                const status = coleta.concluido === 'Sim' ? 'Concluída' : 'Pendente';
                const tr = document.createElement('tr');
                tr.onclick = () => mostrarDetalhes(coleta.id);

                tr.innerHTML = `
                    <td>${coleta.id}</td>
                    <td>${coleta.data_coleta}</td>
                    <td>${coleta.bairro}</td>
                    <td>${coleta.tipo_coleta}</td>
                    <td>${status}</td>
                    <td>
                        ${coleta.concluido === 'Não' 
                            ? `<button class="btn btn-concluir">Concluir</button>` 
                            : ''}
                    </td>
                `;

                const btn = tr.querySelector('button');
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        marcarConcluido(coleta.id);
                    });
                }

                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error('Erro ao buscar coletas:', err));
}

function carregarBairros() {
    fetch('../scripts/php/carregarBairro.php')
        .then(res => res.json())
        .then(bairros => {
            const select = document.getElementById('filtro-bairro');
            select.innerHTML = '<option value="">Todos os bairros</option>';
            bairros.forEach(bairro => {
                const option = document.createElement('option');
                option.value = bairro;
                option.textContent = bairro;
                select.appendChild(option);
            });
        })
        .catch(err => console.error('Erro ao carregar bairros:', err));
}

function configurarEventosDeFiltro() {
    document.getElementById('filtro-bairro').addEventListener('change', carregarColetas);
    document.getElementById('filtro-material').addEventListener('change', carregarColetas);
    document.getElementById('filtro-data').addEventListener('change', carregarColetas);
}

function configurarBotoesLimpar() {
    document.getElementById('clear-bairro').addEventListener('click', () => {
        document.getElementById('filtro-bairro').value = '';
        carregarColetas();
    });

    document.getElementById('clear-material').addEventListener('click', () => {
        document.getElementById('filtro-material').value = '';
        carregarColetas();
    });

    document.getElementById('clear-data').addEventListener('click', () => {
        document.getElementById('filtro-data').value = '';
        carregarColetas();
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
                <p><strong>Tipo de Coleta:</strong> ${dados.tipo_coleta}</p>
                <p><strong>Observações:</strong> ${dados.observacao_coleta}</p>
            `;

            document.querySelector('.conteudo-detalhes').innerHTML = conteudo;
            document.querySelector('.modal-coleta').style.display = 'block';
        })
        .catch(err => console.error('Erro ao buscar detalhes:', err));
}

function marcarConcluido(id) {
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
        .catch(err => console.error('Erro:', err));
    }
}

window.onclick = function (event) {
    const modal = document.querySelector('.modal-coleta');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function fecharModal() {
    document.querySelector('.modal-coleta').style.display = 'none';
}
