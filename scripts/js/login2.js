function fazerLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        showMessage('Por favor, preencha todos os campos');
        return;
    }

    fetch('../scripts/php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, senha }) 
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.mensagem);

        if (data.status === "sucesso") {
            setTimeout(() => {
                window.location.href = "../pages/inicialUsuario.html";
            }, 2500);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showMessage('Ocorreu um erro na requisição. Tente novamente.');
    });
}

function showMessage(message) {
    if (document.querySelector('.custom-modal')) return;

    const modal = document.createElement('div');
    modal.classList.add('custom-modal');
    modal.setAttribute('role', 'alert'); 

    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.95);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1100;
        text-align: center;
        color: var(--dark-color);
    `;

    modal.innerHTML = `
        <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
        <p style="margin: 0;">${message}</p>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.remove();
    }, 2000);
}
