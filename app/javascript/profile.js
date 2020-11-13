var main = new Vue({
    el: '#main',
    data: {
        // links for navbar
        links: {
            'home': '../',
            'favourites': './favourites.html',
            'settings': './profile.html',
            'logout': './logout.php',
            'split': './bill_splitter.html',
            'login': './login.php',
        },

        possibleImages: ['cat', 'dog', 'fox', 'kingfisher', 'rabbit', 'squrriel'],

        // user info
        email: "",
        name: "",
        password: "",
        passwordC: "",
        currentPic: "",
        image: "",

        // booleans
        is_user_login: false,
        is_pwd_invalid: false,
        is_email_invalid: false,
        is_edit: false,
        is_profile_picker_open: false,
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
                    this.image = user.photo;
                    this.currentPic = "../images/profile/" + user.photo + ".png";
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

                $('#select_image').collapse('hide');

                const params = new URLSearchParams();
                params.append('email', this.email);
                params.append('name', this.name);
                params.append('image', this.image);

                console.log(this.image)

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
                    this.getUserInfo();
                    this.toggleEdit();
                }).catch(error => {
                    this.is_email_invalid = true;
                })
            }
        },
    }
});
