<?php 
session_start();

if (isset($_SESSION['user'])) {
   echo "Please wait...";
   session_unset();
   session_destroy();
   echo "<meta http-equiv='refresh' content='1'; url='../index.html'>";

} else {
   header('Location: ../index.html');
	exit();
}

?>