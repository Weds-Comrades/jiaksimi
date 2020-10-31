<?php
/**
 * Check if session exists
 * If dont exists, show defaults
 * Else show user details
 */

// required headers
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// required clases
include_once '../objects/User.php';

$filter_defaults = array(
    "distance" => "500",
    "tags" => "1",
);

// if user session dont exist 
if (!isset($_SESSION['user'])) {
    http_response_code(404);
    echo json_encode(array("message" => "No records found."));
} 
else {
    $results_array = $_SESSION['user'];

    // Add an information node
    $date = new DateTime(null, new DateTImeZone('Asia/Singapore'));
    $results_array["info"] = array(
        "response_datatime_SG" => $date->format('Y-m-d H:i:sP')
    );

    // http 200 OK
    http_response_code(200);
    echo json_encode($results_array);
}


?>