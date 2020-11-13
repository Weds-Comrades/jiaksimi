const main = new Vue({
    el: '#main',
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

        // map variables
        name: "",
        address: "",
        foursq_url: "",
        price: {},
        desc: "",
        categories: [],
        photo: "",
        currentPos: "",
        venuePos: "",


        is_user_login: false,
    },
    mounted: async function () {
        await this.fetchData();
        await this.getUserInfo();
    },
    computed: {
        distance: function () {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            const distance = params.get("distance");
            return distance;
        },
    },
    methods: {
        getUserInfo: async function() {
            await axios.get('../server/api/get-user-details.php')
                .then(res => {
                    var user = res.data.user
                    this.is_user_login = true;
                })
        },
        fetchData: async function() {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            const id = params.get("id");
            const url =
                "https://api.foursquare.com/v2/venues/" +
                id +
                `?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20201020`;
            this.venuePos = params.get('venuePos');
            this.currentPos = params.get('currentPos');
            // this.venuePos = {lat: venuePosCombine[0], lng: venuePosCombine[1]};
            // this.currentPos = {lat: currentPosCombine[0], lng: currentPosCombine[1]};
            
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
        openMapApp: function() {
            window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${this.currentPos}&destination=${this.venuePos}`
        },
    },
})