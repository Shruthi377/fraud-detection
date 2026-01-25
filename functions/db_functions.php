<?php
require_once(_DIR_ . '/../config/db.php');

function executeQuery($sql, $params = []) {
    $conn = getDBConnection();
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $conn->close();
    
    return $result;
}

function fetchAll($sql, $params = []) {
    $result = executeQuery($sql, $params);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function fetchSingle($sql, $params = []) {
    $result = executeQuery($sql, $params);
    return $result->fetch_assoc();
}

function insertData($sql, $params = []) {
    $conn = getDBConnection();
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $insertId = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    
    return $insertId;
}
?>