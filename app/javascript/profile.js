var main = new Vue({
    el: '#main',
    data: {
        // links for navbar
        links: {
            'home': '../',
            'favourites': '#',
            'settings': './edit_profile.html',
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
    },

    mounted: async function() {
        await this.getUserInfo();
    },

    methods: {
        getUserInfo: async function() {
            await axios.get('../../server/api/get-user-details.php')
                .then(res => {
                    var user = res.data.user
                    console.log(user)
                    this.is_user_login = true;
                    this.email = user.email;
                    this.name = user.name;
                    // this.image_location = res.user.photo;
                }).catch(error => {
                    console.log("Not login");
                    // todo: redirect here
                });
        },

        validatePassword: function() {
            return this.password === this.passwordC;
        },

        updateProfile: async function() {
            this.is_pwd_invalid = !this.validatePassword();
        }
    }
});