var main = new Vue({
    el: '#main',
    data: {
        // links for navbar
        links: {
            'home': '../',
            'favourites': '#',
            'settings': './profile.html',
            'logout': './logout.php',
            'split': './bill_splitter.html',
            'login': './login.php',
        },

        // user info
        email: "",
        name: "",
        password: "",
        passwordC: "",
        image_location: "",

        // booleans
        is_user_login: false,
        is_pwd_invalid: false,
        is_email_invalid: false,
        is_edit: false,
    },

    mounted: async function() {
        await this.getUserInfo();
    },

    methods: {
        getUserInfo: async function() {
            await axios.get('../../server/api/get-user-details.php')
                .then(res => {
                    var user = res.data.user
                    this.is_user_login = true;
                    this.email = user.email;
                    this.name = user.name;
                    // this.image_location = res.user.photo;
                }).catch(error => {
                    console.log("Not login");
                    window.location.replace("../");
                });
        },

        validatePassword: function() {
            return this.password === this.passwordC;
        },

        toggleEdit: function() {
            this.is_edit = !this.is_edit;
        },

        updateProfile: async function() {
            this.is_pwd_invalid = !this.validatePassword();
            
            if (!this.is_pwd_invalid) {
                const params = new URLSearchParams();
                params.append('email', this.email);
                params.append('name', this.name);
                params.append('image', this.image_location);

                if(this.password.length > 0) {
                    params.append('password', this.password);
                }
                
                await axios.post(
                    '../../server/api/update-user.php',
                    params,
                ).then(res => {
                    this.password = "";
                    this.passwordC = "";
                    this.is_email_invalid = false;
                    this.toggleEdit();
                }).catch(error => {
                    this.is_email_invalid = true;
                })
            }
        }
    }
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#photo").change(function() {
    readURL(this);
});