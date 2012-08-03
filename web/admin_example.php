<?php
// template for making admin pages
include 'config.php';
header('Content-type: application/json');
session_start();
if (!isset($_SESSION['user_id'])) {
    echo 'Must be admin';
    exit();
}
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if (mysqli_connect_errno()) {
    echo 'Database error';
    exit();
}

try {
    // ensure the user is admin
    $sql = "SELECT is_admin FROM users WHERE id = " . $_SESSION['user_id'];
	$result = $mysqli->query($sql);
	$row = $result->fetch_object();
	$is_admin = $row->is_admin;
	$result->close;
	if ($is_admin) {
	    
	} else {
	    echo "Must be admin";
	}
} catch (Exception $e) {
    echo "Database error";
}
$mysqli->close();
?>
