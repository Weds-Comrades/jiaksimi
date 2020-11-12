const vm = new Vue({
    el: "#info",
    data: {
        name: "",
        address: "",
        foursq_url: "",
        price: {},
        desc: "",
        categories: [],
        photo: "",
    },
    computed: {
        distance: function () {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            const distance = params.get("distance");
            return distance;
        },
    },
    mounted: function () {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get("id");
        const url =
            "https://api.foursquare.com/v2/venues/" +
            id +
            `?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20201020`;

        axios
            .get(url)
            .then((response) => {
                const venue = response.data.response.venue;
                this.name = venue.name;
                this.address = venue.location.address;
                this.foursq_url = venue.canonicalUrl;
                if (venue.hasOwnProperty("price")) {
                    this.price = venue.price;
                }
                if (Object.keys(venue).includes("description")) {
                    this.desc = venue.description;
                }
                this.categories = venue.categories;
                this.photo =
                    venue.bestPhoto.prefix +
                    "cap300" +
                    venue.bestPhoto.suffix;
            })
            .catch((error) => alert(error));
    },
});

const nav = new Vue({
    el: '#nav',
    data: {
        // links for navbar
        links: {
            'home': './',
            'favourites': '#',
            'settings': './sites/profile.html',
            'logout': './sites/logout.php',
            'split': './sites/bill_splitter.html',
            'login': './sites/login.php',
        },

        is_user_login: false,
    },
    mounted: function () {
        this.getUserInfo();
    },
    methods: {
        getUserInfo: async function() {
            await axios.get('../server/api/get-user-details.php')
                .then(res => {
                    var user = res.data.user
                    this.is_user_login = true;
                })
        },
    },
})