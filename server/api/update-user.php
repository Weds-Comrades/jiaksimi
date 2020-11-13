<?php 
/**
 * POST REQUEST
 * Check if session exists
 *   If don't exists, show 404
 *   Else update database
 * 
 * Update database, check if entry exist
 *   If exist, remove record
 *   Else add record
 */

session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// require classes
include_once '../objects/User.php';
include_once '../config/database.php';

// if user session dont exist
if (!isset($_SESSION['user'])) {
    http_response_code(404);
    echo json_encode(array("message" => "What are you doing here."));
} else {
    $session = $_SESSION['user'];
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    $user->getUserByEmail($session["user"]["email"]);

    $new_name = $_POST['name'];
    $new_email = $_POST['email'];
    $new_photo = isset($_POST['image']) ? $_POST['image'] : null;

    // if password is to be changed
    if (strlen($_POST["password"])) {
        $new_pwd = password_hash($_POST["password"], PASSWORD_DEFAULT);
        $isUpdate = $user->updateDetailsWithPassword($new_email, $new_pwd, $new_name, $new_photo);
    } else {
        $isUpdate = $user->updateDetails($new_email, $new_name, $new_photo);
    }

    // if false, means email already taken
    if (!$isUpdate) {
        $message = "Email already used";
        http_response_code(500);
    }
    else {
        $response_array = array();
        $message = "Updated";

        $response_array['user'] = $user->getUserInformation();
        $response_array['filter'] = $user->getUserFilterSettings();
        $response_array['locations'] = $user->getFavouriteLocations();
        $_SESSION['user'] = $response_array;

        http_response_code(200);
    }
    echo json_encode(array("message" => $message));
}
?>
