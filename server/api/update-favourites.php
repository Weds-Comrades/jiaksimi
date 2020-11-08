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

// required clases
include_once '../objects/User.php';
include_once '../config/database.php';

// if user session dont exist
if (!isset($_SESSION['user'])) {
    http_response_code(404);
    echo json_encode(array("message" => "No login session found."));
}
else {
    if (!isset($_POST['place_id'])) {
        http_response_code(500);
        echo json_encode(array("message" => "No attribute found"));
    } else {
        $place_id = $_POST['place_id'];
        $session = $_SESSION['user'];
        $message = "Error has occured";
        $isUpdate = false;
    
        $database = new Database();
        $db = $database->getConnection();
        $user = new User($db);
        $user->getUserByEmail($session["user"]['email']);
    
        // check if user favourite exist
        if ($user->isLocationFavourite($place_id)) {
            if ($user->removeFavouriteLocation($place_id)) {
                $message = "Removed $place_id";
                $isUpdate = true;
            }
        } else {
            if ($user->addFavouriteLocation($place_id)) {
                $message = "Added $place_id";
                $isUpdate = true;
            }
        }

        if (!$isUpdate) {
            http_response_code(500);
        } else {
            // Update session
            $response_array = array();

            $response_array['user'] = $user->getUserInformation();
            $response_array['filter'] = $user->getUserFilterSettings();
            $response_array['locations'] = $user->getFavouriteLocations();
            $_SESSION['user'] = $response_array;

            http_response_code(200);
        }
        echo json_encode(array("message" => $message));
    }
}
?>
