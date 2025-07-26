async function carregarNomeMotorista() {
    try {
        const resposta = await fetch('../scripts/php/inicialMotorista.php');
        const data = await resposta.json();

        if (data.status === "sucesso") {
            const nomeOuEmail = data.nome ? data.nome : data.email;
            document.getElementById('welcome-msg').textContent = `Olá, ${nomeOuEmail}!`;
        } else {
            console.log("Usuário não autenticado");
        }
    } catch (error) {
        console.error("Erro ao buscar nome do motorista:", error);
    }
}

window.onload = carregarNomeMotorista;