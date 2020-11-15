<?php
/**
 * To login the database and create a session
 */
session_start();
include_once '../../server/config/database.php';
include_once '../../server/objects/User.php';

// if login already
if (isset($_SESSION['user'])) {
	header('Location: ../index.html');
	exit();
}

// Process
if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$email = trim($_POST["email_input"]);
	$password = trim($_POST["password_input"]);
	$error = array();

	// Verify user
	$database = new Database();
	$db = $database->getConnection();
	$user = new User($db);
		
	// user not found
	if (!$user->getUserByEmail($email)) {
		$error['email'] =  true;
		$_SESSION['error'] = $error;
	}
	else {
		// verify password
		// no matchy
		if (!$user->isPasswordMatch($password)) {
			$error['password'] =  true;
			$_SESSION['error'] = $error;
		}
		else {
			session_unset();

			$response_array = array();
			$response_array['user'] = $user->getUserInformation();
			$response_array['filter'] = $user->getUserFilterSettings();
			$response_array['locations'] = $user->getFavouriteLocations();
			$_SESSION["user"] = $response_array;
			
			header('Location: ../index.html');
			exit();
		}

	}
}
?>

<!DOCTYPE html>
<html>
	<head>
		<!-- Required meta tags -->
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>Login</title>
		
		 <!-- CSS -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
		<link rel="stylesheet" href="../css/shared.css">
		<link rel="stylesheet" href="../css/login.css">

	</head>

	<body>
		<div class="container" id="title">
			<h1>Login</h1>
		</div>

		<div class="container px-5">
			<form action="<?php echo(htmlspecialchars($_SERVER["PHP_SELF"]))?>" method="post">
				<div class="form-group">
					<label for="email-input">Email address</label>
					<input
						name="email_input" type="text" id="email-input" aria-describedby="emailHelp" required
						<?php echo isset($error['email']) ? "class='form-control is-invalid'" : "class='form-control'" ?>
					>
					<div class='invalid-feedback'>We couldn't find an account linked to this email</div>
				</div>
				<div class="form-group">
					<label for="password-input">Password</label>
					<input 
						name="password_input" type="password" id="password-input" required 
						<?php echo isset($error['password']) ? "class='form-control is-invalid'" : "class='form-control'" ?>
					>
					<div class='invalid-feedback'>Incorrect Password</div>
				</div>

				<div class="button">
					<button type="submit" class="btn btn-primary">Login</button>
				</div>
			</form>
			
			<div id="link">
				<a class="text-light" href="./new_account.html">Sign up Today!</a>
			</div>

		</div>
	</body>

</html>