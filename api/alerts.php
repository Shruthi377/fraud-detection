<?php
require_once(_DIR_ . '/../functions/db_functions.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all fraud alerts with transaction details
    $alerts = fetchAll("
        SELECT a.*, t.amount, t.location, t.transaction_time, u.name as user_name
        FROM Fraud_Alerts a
        JOIN Transactions t ON a.transaction_id = t.transaction_id
        JOIN Users u ON t.user_id = u.user_id
        ORDER BY a.alert_time DESC
    ");
    echo json_encode(['success' => true, 'data' => $alerts]);
}
?>