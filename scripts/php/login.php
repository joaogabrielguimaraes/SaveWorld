<?php
require './config.php';

session_start(); 

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    if (empty($email) || empty($senha)) {
        echo json_encode(["status" => "erro", "mensagem" => "Por favor, preencha todos os campos"]);
        exit();
    }

    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Erro na conexão: " . $e->getMessage());
    }

    $stmt = $conn->prepare("SELECT id, email, senha FROM dados WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        if ($senha === $usuario['senha']) {
            $_SESSION['usuario_id'] = $usuario['id']; 
            echo json_encode(["status" => "sucesso", "mensagem" => "Login realizado com sucesso!"]);
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Senha incorreta!"]);
        }
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "E-mail não encontrado!"]);
    }
}
?>
