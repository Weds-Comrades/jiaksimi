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

// var_dump($_POST);

// if user session dont exist
if (!isset($_SESSION['user'])) {
  http_response_code(404);
  echo json_encode(array("message" => "What are you doing here."));
} else {
    if (!isset($_POST['auth'])) {
        // ensure that the request is authenticate as anyone can access 
        http_response_code(405);
        echo json_encode(array("message" => "You done goof"));
    } else {
        $distance = $_POST['distance'];
        $tag = empty($_POST['tags']) ? [] : explode(',', $_POST['tags']);
        $session = $_SESSION['user'];
        

        $messsge = "Error has occured";
        $isUpdate = false;

        $database = new Database();
        $db = $database->getConnection();
        $user = new User($db);
        $user->getUserByEmail($session["user"]["email"]);

        // save filter
        $user->setFilter($distance, $tag);
        // var_dump($user);
        if ($test = $user->saveFilters()) {
            $isUpdate = true;
            $message = "Updated Filters";
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