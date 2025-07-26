document.getElementById('submitBtn').addEventListener('click', submitForm);

document.getElementById('cpf').addEventListener('input', function () {
    let cpf = this.value.replace(/\D/g, '').slice(0, 11);

    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    }

    this.value = cpf;
});

document.getElementById('telefone').addEventListener('input', function () {
    let tel = this.value.replace(/\D/g, '').slice(0, 11);

    if (tel.length > 6) {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1)$2-$3');
    } else if (tel.length > 2) {
        tel = tel.replace(/(\d{2})(\d{0,5})/, '($1)$2');
    } else {
        tel = tel.replace(/(\d{0,2})/, '($1');
    }

    this.value = tel;
});

function submitForm() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!nome || !cpf || !telefone || !email || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (senha.length !== 8) {
        alert('A senha deve conter exatamente 8 caracteres!');
        return;
    }

    const formData = new URLSearchParams({
        nome,
        cpf,
        telefone,
        email,
        senha
    });

    fetch('../scripts/php/primeiroCadastro.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
        alert(data.mensagem);
        if (data.sucesso) {
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
        }
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao realizar o cadastro. Tente novamente.');
    });
}
