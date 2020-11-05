<?php 
session_start();

if (isset($_SESSION['user'])) {
   $user = $_SESSION['user'];
   $name = $user['user']['name'];

   echo $name . " has logged out";
}

session_destroy();

?>