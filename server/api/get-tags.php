<?php 
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// required classes
include_once '../config/database.php';
include_once '../objects/Tag.php';

// init object
$database = new Database();
$db = $database->getConnection();
$tag = new Tag($db);

// query products
$stmt = $tag->getAll();
$count = $stmt->rowCount();

// if 0 return a 404
if ($count == 0) {
    // set 404, not found
    http_response_code(404);
    
    // inform that no items are found
    echo json_encode(
        array("message" => "No records found.")
    );
}
// records found
else {
    // products array
    $results_array = array();
    $results_array["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // extract row
        // this will make $row['tag_uid'] to just $tag_uid only
        extract($row);

        $item = array(
            "id" => $id,
            "name" => $tag_name,
            "uid" => $tag_uid,
        );

        array_push($results_array["records"], $item);
    }

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