<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'conta';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['erro' => 'Erro na conexão com o banco de dados']));
}

$filtro_bairro   = $_GET['bairro'] ?? '';
$filtro_material = $_GET['material'] ?? '';
$filtro_data     = $_GET['data'] ?? '';

$sql = "SELECT id, data_coleta, bairro, tipo_coleta, concluido FROM enderecos WHERE 1=1";
$tipos = '';
$params = [];

if (!empty($filtro_bairro)) {
    $sql .= " AND bairro = ?";
    $tipos .= 's';
    $params[] = $filtro_bairro;
}
if (!empty($filtro_material)) {
    $sql .= " AND tipo_coleta = ?";
    $tipos .= 's';
    $params[] = $filtro_material;
}
if (!empty($filtro_data)) {
    $sql .= " AND data_coleta = ?";
    $tipos .= 's';
    $params[] = $filtro_data;
}

$sql .= " ORDER BY data_coleta ASC";

$stmt = $conn->prepare($sql);
if ($params) {
    $stmt->bind_param($tipos, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$coletas = [];
while ($row = $result->fetch_assoc()) {
    $coletas[] = $row;
}

echo json_encode($coletas);
?>
