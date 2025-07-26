<?php
header('Content-Type: application/json');
session_start();
require './config.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['error' => 'Usuário não está logado.']);
    exit;
}

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Erro de conexão com o banco de dados: ' . $conn->connect_error]));
}

$sqlConcluidas   = "SELECT COUNT(*) AS total FROM enderecos WHERE concluido = 'sim'";
$sqlEmAndamento  = "SELECT COUNT(*) AS total FROM enderecos WHERE concluido != 'sim' OR concluido IS NULL";
$sqlUltimas      = "SELECT data_coleta, bairro, tipo_coleta, concluido FROM enderecos ORDER BY id DESC LIMIT 15";
$sqlParticipantes = "SELECT COUNT(id) AS total FROM usuarios";
$sqlMotoristas = "SELECT COUNT(*) AS total FROM loginmotorista";

$concluidas    = $conn->query($sqlConcluidas)->fetch_assoc()['total'];
$emAndamento   = $conn->query($sqlEmAndamento)->fetch_assoc()['total'];
$participantes = $conn->query($sqlParticipantes)->fetch_assoc()['total'];
$motoristas = $conn->query($sqlMotoristas)->fetch_assoc()['total'];


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
        'participantes' => $participantes,
        'motoristas'    => $motoristas
    ],
    'coletas' => $ultimas
]);

$conn->close();
?>
