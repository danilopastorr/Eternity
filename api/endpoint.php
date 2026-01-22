
<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("SELECT id, name, login, role FROM representatives WHERE login = ? AND password = ?");
        $stmt->execute([$data['login'], $data['password']]);
        $user = $stmt->fetch();
        echo json_encode($user ?: ['error' => 'Credenciais inválidas']);
        break;

    case 'list_clients':
        $repId = $_GET['representative_id'] ?? null;
        if ($repId) {
            $stmt = $pdo->prepare("SELECT * FROM clients WHERE representative_id = ?");
            $stmt->execute([$repId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM clients");
        }
        echo json_encode($stmt->fetchAll());
        break;

    case 'save_client':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO clients (name, cpf, phone, status, company_id, representative_id) VALUES (?, ?, ?, 'BASIC', ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['name'], $data['cpf'], $data['phone'], $data['company_id'], $data['representative_id']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    default:
        echo json_encode(['error' => 'Ação não permitida']);
        break;
}
?>
