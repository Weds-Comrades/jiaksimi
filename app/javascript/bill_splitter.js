var bill = new Vue({
    el: 'main',
    data: {
        is_user_login: false,
        links: {
            'home': '../',
            'favourites': './favourites.html',
            'settings': './profile.html',
            'logout': '../../server/test/logout.php',
            'split': './bill_splitter.html',
            'login': './login.php',
        },
        image: "",

        // calculation
        max_people: 20,
        people: 2,
        srv: 10,
        gst: 7,

        people_list: [],
        sharing_people_list: [],

        dish_cost: "",
        dish_name: "",

        // boolean
        is_ready: false,
        is_no_people: false,
    },
    mounted: async function(){
        await this.getUserInfo();
    },
    methods: {
        getUserInfo: async function() {
            await axios.get('../../server/api/get-user-details.php')
                .then((res => {
                    this.is_user_login = true;
                    this.image = "../images/profile/" + res.data.user.photo + ".png";
                }))
                .catch(err => { console.log(err); });
        },
        toggleView: function() {
            this.is_ready = !this.is_ready;

            if (this.is_ready) {
                for (i = 0; i < this.people; i++) {
                    this.people_list.push({
                        id: i,
                        name: `Person ${i + 1}`,
                        money: 0,
                        dish: [],
                    });
                }
            } else {
                // reset things
                this.people = 2;
                this.srv = 10;
                this.gst = 7;
                this.people_list = [];
                this.sharing_people_list = [];
            }
        },
        addItem: function() {
            // calculate cost of dish
            const total_dish_cost = parseFloat(this.dish_cost) * (1 + (parseFloat(this.srv) / 100)) * (1 + (parseFloat(this.gst) / 100));

            if (this.sharing_people_list.length === 0) {
                this.is_no_people = true
            } else {
                for (const id of this.sharing_people_list) {
                    var pax = this.people_list[id];
                    pax.money += total_dish_cost / this.sharing_people_list.length;
                    pax.dish.push(this.dish_name);
    
                    // update
                    this.people_list[id] = pax;
                }
    
                // clear selection
                this.dish_cost = "";
                this.dish_name = "";
                this.sharing_people_list = [];
                this.is_no_people = false;
            }
        },
    },
})
