<?php

include_once './database.php';
include_once '../objects/User.php';

$dao = new User();
if (isset($_POST['id'])) {
    $id = $_POST['id'] // get from login 
}
$user = $dao->getUserById($id); 

?>

<html>
<body>

    <?php
        echo "
        <div class='container'>
            <div class='avatar-preview'>
            <div id='imagePreview' style='background-image: url(
                'images/{$user->photo_bin}')';>
            </div>
            <h1><b>Hello, {$user->name}</b></h1>
        </div>
        
        <div class='container'> 
            <div class='row'> 
                <div class='col'></div> 
                <div class='col-6'> 
                    <form>
                        <div class='form-group'>
                            <label for='name'>Name</label>
                            <input type='text' class='form-control' id='name_input' name='name_input' placeholder='{$user->name}' disabled='disabled'>
                        </div>
                        <div class='form-group'>
                            <label for='email'>Email</label>
                            <input type='text' class='form-control' id='email_input' name='email_input' placeholder='{$user->email}' disabled='disabled'>
                        </div>

                        <div class='text-center'>
                            <button name='edit_profile' type='submit' class='btn btn-secondary' onclick='../../sites/edit_profile_page.html'>Edit Profile</button>
                        </div>
                        
                    </form>
                </div>
                <div class='col'></div>     
            </div> 
        </div>";
            
            
    ?>
</body>
</html>