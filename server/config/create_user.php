<?php 
/**
 *  To preload users into the database.
 *  A simple form as this is just use for dev purposes only
 */

  include_once './database.php';
  include_once '../objects/User.php';

  // define variables and initalise as empty
  $email = $password = $name = "";

  // Process
  if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // if username is empty do nothing
    if (empty(trim($_POST["email_input"])) || empty(trim($_POST["name_input"]))) {
      echo "Need to input email or name";
    } else {
      // INSERT INTO DATABASE
      $database = new Database();
      $db = $database->getConnection();
      $user = new User($db);
      
      $email = trim($_POST["email_input"]);
      $password = password_hash($_POST["password_input"], PASSWORD_DEFAULT); // Create a password hash
      $name = trim($_POST["name_input"]);

      $user->setUserDetails($email, $password, $name);
    
      if ($user->saveUser()) {
        echo "
        <div class='alert alert-success' role='alert'>
          Successfully added $email into database
        </div>
        ";
      } else {
        echo "
          <div class='alert alert-danger' role='alert'>
            Something happened
          </div>
        ";
      }
    }
  }

?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Create a User (DEV ONLY)</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  </head>
  <body>
    <div class="container mt-3">
      <h1>Add a User to database TEST</h1>
      <form action="<?php echo(htmlspecialchars($_SERVER["PHP_SELF"]))?>" method="post">
        <div class="form-group">
          <label for="email-input">Email address</label>
          <input name="email_input" type="text" class="form-control" id="email-input" aria-describedby="emailHelp">
        </div>
        <div class="form-group">
          <label for="password-input">Password</label>
          <input name="password_input" type="password" class="form-control" id="password-input" required>
        </div>
        <div class="form-group">
          <label for="name-input">Name</label>
          <input name="name_input" type="text" class="form-control" id="name-input" aria-describedby="nameHelp">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>

    </div>
  </body>
</html>