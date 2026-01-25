<?php
require_once(_DIR_ . '/../functions/db_functions.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all users
    $users = fetchAll("SELECT * FROM Users");
    echo json_encode(['success' => true, 'data' => $users]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new user
    $data = json_decode(file_get_contents('php://input'), true);
    $insertId = insertData(
        "INSERT INTO Users (name, email, phone, registration_date) VALUES (?, ?, ?, ?)",
        [$data['name'], $data['email'], $data['phone'], $data['registration_date']]
    );
    echo json_encode(['success' => true, 'id' => $insertId]);
}
?>