<?php

include_once './database.php';
include_once '../objects/User.php';

$msg = '';
$status = false;
if( isset($_POST['id']) && isset($_POST['email_input']) && isset($_POST['password_input']) && isset($_POST['name_input']) && isset($_POST['photo'])) {
    $id = $_POST['id'];
    $email = trim($_POST['email']);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);;
    $name = trim($_POST['name']);
    $photo = $_POST['photo'];


    $dao = new User();
    $status = $dao->updateDetails($id, $email, $password, $name, $photo); 
}


?>