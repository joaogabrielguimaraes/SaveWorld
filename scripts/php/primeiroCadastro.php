<?php
$host = 'localhost';
$dbname = 'conta';
$username = 'root';
$password = '';

$conexao = mysqli_connect($host, $username, $password, $dbname);

if (!$conexao) {
    die("Erro na conexão: " . mysqli_connect_error());
}

$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$cpf = mysqli_real_escape_string($conexao, $_POST['cpf']);
$telefone = mysqli_real_escape_string($conexao, $_POST['telefone']);
$email = mysqli_real_escape_string($conexao, $_POST['email']);
$senha = mysqli_real_escape_string($conexao, $_POST['senha']);
$data_criacao = date('Y-m-d H:i:s'); 

$verifica = "SELECT * FROM usuarios WHERE email = '$email' OR cpf = '$cpf'";
$resultado = mysqli_query($conexao, $verifica);

if (mysqli_num_rows($resultado) > 0) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail ou CPF já está cadastrado!']);
    mysqli_close($conexao);
    exit;
}

mysqli_begin_transaction($conexao);

try {
    $query1 = "INSERT INTO usuarios (nome, cpf, telefone, email, senha)
               VALUES ('$nome', '$cpf', '$telefone', '$email', '$senha')";
    mysqli_query($conexao, $query1);

    $query2 = "INSERT INTO dados (email, senha)
               VALUES ('$email', '$senha')";
    mysqli_query($conexao, $query2);

    mysqli_commit($conexao);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Cadastro realizado com sucesso!']);
} catch (Exception $e) {
    mysqli_rollback($conexao);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao realizar o cadastro: ' . $e->getMessage()]);
}

mysqli_close($conexao);
?>
