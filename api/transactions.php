<?php
require_once(_DIR_ . '/../functions/db_functions.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all transactions
    $transactions = fetchAll("
        SELECT t.*, u.name as user_name 
        FROM Transactions t
        JOIN Users u ON t.user_id = u.user_id
    ");
    echo json_encode(['success' => true, 'data' => $transactions]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new transaction
    $data = json_decode(file_get_contents('php://input'), true);
    $insertId = insertData(
        "INSERT INTO Transactions (user_id, amount, location, transaction_time, status) 
        VALUES (?, ?, ?, ?, ?)",
        [$data['user_id'], $data['amount'], $data['location'], $data['transaction_time'], $data['status']]
    );
    
    // Check if transaction should trigger fraud alert
    if ($data['amount'] > 50000) { // Example threshold
        insertData(
            "INSERT INTO Fraud_Alerts (transaction_id, reason, alert_time) 
            VALUES (?, ?, NOW())",
            [$insertId, 'High amount transaction']
        );
    }
    
    echo json_encode(['success' => true, 'id' => $insertId]);
}
?>