const main = new Vue({
    el: '#main',
    data: {
        // user
        name: "",
        email: "",
        user: "",
        password: "",
        passwordC: "",       
        
        // validation
        is_pwd_invalid: false,
        is_email_invalid: false,

        possibleImages: ['cat', 'dog', 'fox', 'kingfisher', 'rabbit', 'squrriel'],
    },
    mounted: async function() {
        // you shouldnt be here if youre login
        await axios.get("../../server/api/get-user-details.php")
            .then(() => {window.location.replace("../")});
    },
    methods: {
        validatePassword: function() {
            return this.password === this.passwordC;
        },
        rngImage: function() {
            var num = Math.floor(Math.random() * this.possibleImages.length);
            return this.possibleImages[num];
        },
        createAccount: async function() {
            this.is_pwd_invalid = !this.validatePassword();
            this.is_email_invalid = false;

            const data = {
                'email': this.email.toLowerCase(),
                'name': this.name,
                'password': this.password,
                'image': this.rngImage(),
            }

            if (!this.is_pwd_invalid) {
                const params = new URLSearchParams();
                params.append('user', JSON.stringify(data));
                
                await axios.post('../../server/api/add-user.php', params)
                    .then(res => {
                        console.log(res)
                        window.location.replace("../");
                    }).catch(err => {
                        // at this point, only error should be email in used
                        this.is_email_invalid = true;
                    })
            }
        }
    },
});
