<?php
/**
 * To login the database and create a session
 * Dev purpose
 */
session_start();
include_once '../config/database.php';
include_once '../objects/User.php';

// Process
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty(trim($_POST["email_input"]))) {
    echo "Input your email";
  }
  else {
    $email = trim($_POST["email_input"]);
    $password = trim($_POST["password_input"]);
    // echo ("$email  $password\n");

    
    // Verify user
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    // $test = $user->getUserByEmail($email);
    // var_dump($user);


    
    // user not found
    if (!$user->getUserByEmail($email)) {
      echo "Not found";
    } else {

      // verify password
      // no matchy
      
      if (!$user->isPasswordMatch($password)) {
        echo "Invalid password";
      } else {
        $_SESSION["user"] = $user;
        header('Location: ../api/get-user-details.php');
      }
    }
  }


}


?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Login (DEV ONLY)</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  </head>

  <body>
    <div class="container mt-3">
      <h1>Login Test</h1>

      <form action="<?php echo(htmlspecialchars($_SERVER["PHP_SELF"]))?>" method="post">
        <div class="form-group">
            <label for="email-input">Email address</label>
            <input name="email_input" type="text" class="form-control" id="email-input" aria-describedby="emailHelp">
          </div>
          <div class="form-group">
            <label for="password-input">Password</label>
            <input name="password_input" type="password" class="form-control" id="password-input" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
 
    </div>
  </body>

</html>