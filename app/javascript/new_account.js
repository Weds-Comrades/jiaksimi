function addUser(event) {
    event.preventDefault();

    const form = document.forms["create-account"];
    const password_container_1 = document.getElementById('password-c');
    const password_container_2 = document.getElementById('passwordConfirm-c');
    const email_container = document.getElementById('email-c');

    const newUser = JSON.stringify({
        name: form['name'].value.trim(),
        email: form['email'].value.trim(),
        password: form['password'].value.trim(),
    });

    resetValidation();

    if (!validatePassword()) {
        // show error msg
        password_container_1.childNodes[3].className = "form-control is-invalid";
        password_container_2.childNodes[3].className = "form-control is-invalid";
        
    } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.replace("../index.html");
            }
            else if (this.status == 500) {
                // email exist 
                email_container.childNodes[3].className = "form-control is-invalid";
            }
        };
        xhr.open("POST", "../../server/api/add-user.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("user=" + newUser);
    }
    
}

function validatePassword() {
    const form = document.forms["create-account"];
    return form['password'].value.trim() === form['password2'].value.trim();
}

function resetValidation() {
    const password_container_1 = document.getElementById('password-c');
    const password_container_2 = document.getElementById('passwordConfirm-c');
    const email_container = document.getElementById('email-c');

    password_container_1.childNodes[3].className = "form-control";
    password_container_2.childNodes[3].className = "form-control";
    email_container.childNodes[3].className = "form-control";
}

function isLogin() {
    // if login, redirect to index.html.
    // you shouldnt be here
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("../index.html");
        }
    };
    xhr.open("GET", "../../server/api/get-user-details.php", true);
    xhr.send();
}

// main
isLogin();
document.getElementById('button-submit').addEventListener('click', addUser);
