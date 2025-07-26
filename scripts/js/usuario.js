AOS.init({
    duration: 1000,
    once: true
});

let horarioSelecionado = '';
let tipoColetaSelecionado = '';

window.addEventListener("DOMContentLoaded", () => {
    const inputData = document.getElementById("data");
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataAtual = `${ano}-${mes}-${dia}`;
    inputData.setAttribute("min", dataAtual);

    carregarAgendamentos();
});

function showMessage(msg) {
    alert(msg);  
}

function buscarCEP(){
    const cep = document.getElementById("cep").value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showMessage("CEP inválido. Digite os 8 números.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) {
                showMessage("CEP não encontrado.");
                return;
            }
            document.getElementById("rua").value = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro || "";
            document.getElementById("cidade").value = data.localidade || "";
        })
        .catch(() => showMessage("Erro ao buscar o CEP. Tente novamente."));
}

function selectHorario(element) {
    document.querySelectorAll('.horario').forEach(h => h.classList.remove('selecionado'));
    element.classList.add('selecionado');
    horarioSelecionado = element.querySelector('p').textContent;
}

function selectTipo(element) {
    const selecionado = element.classList.contains('tipo-selecionado');
    if (selecionado) {
        element.classList.remove('tipo-selecionado');
        tipoColetaSelecionado = '';
    } else {
        element.classList.add('tipo-selecionado');
        tipoColetaSelecionado = element.querySelector('h3').textContent;
    }
}

// marcar apenas um
// function selectTipo(element) {
//     document.querySelectorAll('.tipo').forEach(t => t.classList.remove('tipo-selecionado'));

//     element.classList.add('tipo-selecionado');
//     tipoColetaSelecionado = element.querySelector('h3').textContent;
// }

function salvarEndereco() {
    const campos = {
        complemento: document.getElementById("complemento").value.trim(),
        rua: document.getElementById("rua").value.trim(),
        numero: document.getElementById("numero").value.trim(),
        cep: document.getElementById("cep").value.trim(),
        bairro: document.getElementById("bairro").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        dataColeta: document.getElementById("data").value.trim(),
        observacaoColeta: document.getElementById("observacoes").value.trim(),
        horarioColeta: horarioSelecionado,
        tipoColeta: tipoColetaSelecionado
    };

    const obrigatorios = ['rua', 'numero', 'Ccp', 'bairro', 'cidade', 'data', 'horarioColeta', 'tipoColeta'];
    const faltantes = obrigatorios.filter(c => !campos[c]);

    if (faltantes.length > 0) {
        showMessage("Por favor, preencha todos os campos obrigatórios: " + faltantes.join(', '));
        return;
    }

    fetch('../scripts/php/salvar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campos)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showMessage("Endereço salvo com sucesso!");
            carregarAgendamentos();
            limparCampos();
        } else {
            showMessage("Erro ao salvar o endereço: " + (data.error || 'Erro desconhecido'));
        }
    })
    .catch(() => showMessage("Erro na comunicação com o servidor."));
}

function limparCampos() {
    ['complemento', 'rua', 'numero', 'cep', 'bairro', 'cidade', 'data', 'observacoes'].forEach(id => {
        document.getElementById(id).value = '';
    });

    document.querySelectorAll('.horario').forEach(el => el.classList.remove('selecionado'));
    document.querySelectorAll('.tipo-selecionado').forEach(el => el.classList.remove('tipo-selecionado'));

    horarioSelecionado = '';
    tipoColetaSelecionado = '';
}

function carregarAgendamentos() {
    fetch('../scripts/php/historico.php')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data.length) {
                preencherTabela(data.data);
            } else {
                preencherTabela([]); 
            }
        })
        .catch(() => showMessage("Erro ao carregar agendamentos."));
}

function preencherTabela(agendamentos) {
    const tbody = document.getElementById('tabela-agendamentos');
    tbody.innerHTML = '';

    if (agendamentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Nenhum agendamento encontrado.</td></tr>`;
        return;
    }

    agendamentos.forEach((a, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${a.complemento || 'N/A'}</td>
            <td>${a.rua}, ${a.numero || 'N/A'}</td>
            <td>${a.cidade || 'N/A'}</td>
            <td>${a.data_coleta || 'N/A'}</td>
            <td>${a.horario_coleta || 'N/A'}</td>
            <td>${a.tipo_coleta || 'N/A'}</td>
            <td>${a.concluido || 'N/A'}</td>
            <td>
                <button class="btn-excluir" onclick="cancelarAgendamento(${a.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
            </td>
            
        `;
        tbody.appendChild(tr);
    });
}

function cancelarAgendamento(id) {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
        fetch(`../scripts/php/cancelar.php?id=${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage("Agendamento cancelado com sucesso!");
                    carregarAgendamentos();
                } else {
                    showMessage("Erro ao cancelar agendamento: " + (data.error || 'Erro desconhecido'));
                }
            })
            .catch(() => showMessage("Erro na comunicação com o servidor."));
    }
}
