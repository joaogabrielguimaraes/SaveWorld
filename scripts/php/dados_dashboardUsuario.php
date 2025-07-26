<?php
header('Content-Type: application/json');
session_start();
require './config.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['error' => 'Usuário não está logado.']);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Erro de conexão com o banco de dados: ' . $conn->connect_error]));
}

if ($usuario_id === 1) {
    $sqlConcluidas   = "SELECT COUNT(*) AS total FROM enderecos WHERE concluido = 'sim'";
    $sqlEmAndamento  = "SELECT COUNT(*) AS total FROM enderecos WHERE concluido != 'sim' OR concluido IS NULL";
    $sqlUltimas      = "SELECT data_coleta, bairro, tipo_coleta, concluido FROM enderecos ORDER BY id DESC LIMIT 10";
} else {
    $sqlConcluidas   = "SELECT COUNT(*) AS total FROM enderecos WHERE concluido = 'sim' AND usuario_id = $usuario_id";
    $sqlEmAndamento  = "SELECT COUNT(*) AS total FROM enderecos WHERE (concluido != 'sim' OR concluido IS NULL) AND usuario_id = $usuario_id";
    $sqlUltimas      = "SELECT data_coleta, bairro, tipo_coleta, concluido FROM enderecos WHERE usuario_id = $usuario_id ORDER BY id DESC LIMIT 10";
}

$sqlTotalColetas = "SELECT COUNT(*) AS total FROM enderecos WHERE usuario_id = $usuario_id";


$concluidas    = $conn->query($sqlConcluidas)->fetch_assoc()['total'];
$emAndamento   = $conn->query($sqlEmAndamento)->fetch_assoc()['total'];
$totalColetas = $conn->query($sqlTotalColetas)->fetch_assoc()['total'];


$result = $conn->query($sqlUltimas);
$ultimas = [];

while ($row = $result->fetch_assoc()) {
    $ultimas[] = [
        'data'     => date('d/m/Y', strtotime($row['data_coleta'])),
        'local'    => $row['bairro'],
        'material' => $row['tipo_coleta'],
        'status'   => strtolower($row['concluido']) === 'sim' ? 'Concluído' : 'Pendente'
    ];
}

echo json_encode([
    'stats' => [
        'concluidas'    => $concluidas,
        'em_andamento'  => $emAndamento,
        'total_coletas'  => $totalColetas
    ],
    'coletas' => $ultimas
]);

$conn->close();
?>
