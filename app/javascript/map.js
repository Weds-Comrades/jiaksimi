const main = new Vue({
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
        foursq_id: "",
        image: "",

        is_user_login: false,
        is_favourite: false,
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
            await axios.get('../../server/api/get-user-details.php')
                .then(res => {
                    this.is_favourite = res.data.locations.includes(this.foursq_id);
                    this.image = "../images/profile/" + res.data.user.photo + ".png";
                    this.is_user_login = true;
                })
        },
        fetchData: async function() {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            this.foursq_id = params.get("id");
            const url =
                "https://api.foursquare.com/v2/venues/" +
                this.foursq_id +
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
                    this.address = venue.location.address !== undefined ? venue.location.address : venue.name;
                    this.foursq_url = venue.canonicalUrl;
                    if (venue.hasOwnProperty("price")) {
                        this.price = venue.price;
                    }
                    if (Object.keys(venue).includes("description")) {
                        this.desc = venue.description;
                    }
                    this.categories = venue.categories;

                    this.photo = venue.bestPhoto !== undefined ?
                        venue.bestPhoto.prefix + "cap300" + venue.bestPhoto.suffix :
                        venue.categories[0].icon.prefix + + "512" + venue.categories[0].icon.suffix;
                })
                .catch((error) => alert(error));
        },
        openMapApp: function() {
            // If user is on MacOS or iOS, open apple maps
            // else default to google maps
            if (navigator.appVersion.indexOf("Mac") > 0 || navigator.appVersion.indexOf("like Mac") > 0) {
                window.open(`http://maps.apple.com/?saddr=${this.currentPos}&daddr=${this.venuePos}`, '_blank');
            } else {
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${this.currentPos}&destination=${this.venuePos}`, '_blank');
            }
        },

        // send to server to set as or remove as favourites
        updateFavourite: async function() {
            const params = new URLSearchParams();
            params.append('place_id', this.foursq_id);

            await axios.post("../../server/api/update-favourites.php", params)
                .then(res => {
                    // update user info
                    this.getUserInfo();
                }).catch(error => console.log(error.response));
        },
    },
})
