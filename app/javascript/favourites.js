var main = new Vue({
    el: "#main",
    data: {
        links: {
            'home': '../',
            'favourites': './favourites.html',
            'settings': './profile.html',
            'logout': './logout.php',
            'split': './bill_splitter.html',
            'login': './login.php',
        },

        favourites_list: [],
        venues: [],

        is_user_login: false,
        is_favourite_loaded: false,
    },
    mounted: async function() {
        await this.getUserInfo();
        await this.loadFavourites();
    },
    methods: {
        getUserInfo: async function() {
            await axios.get('../../server/api/get-user-details.php')
                .then((res => {
                    var user = res.data; 
                    this.is_user_login = true;
                    this.favourites_list = user.locations;
                }))
                .catch(err => { window.location.replace("../index.html"); });
        },
        loadFavourites: async function() {
            this.is_favourite_loaded = false;
            var fetch_venue = [];
            for (const venue of this.favourites_list) {
                const url_venue_details = `https://api.foursquare.com/v2/venues/${venue}?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20200928`;
                var details = await axios.get(url_venue_details)
                    .then(response => {
                        var photo_raw = response.data.response.venue.bestPhoto !== undefined
                            ? response.data.response.venue.bestPhoto 
                            : response.data.response.venue.categories[0].icon;

                        var name = response.data.response.venue.name;
                        

                        return {
                            photo: photo_raw.prefix + 'cap300' + photo_raw.suffix,
                            name: name,
                        }
                    });

                // dev purpose
                // var photo = "../images/bg-sg-1.jpg";

                // push to array
                fetch_venue.push({
                    id: venue,
                    name: details.name,
                    photo: details.photo,
                    url: `#`,
                });
            }
            this.venues = fetch_venue;
            this.is_favourite_loaded = true;
        },
        deleteCard: async function(venue) {
            var isDelete = confirm(`Do you want to delete ${venue.name}?`);

            if (isDelete) {
                const params = new URLSearchParams();
                params.append('place_id', venue.id);
                await axios.post("../../server/api/update-favourites.php", params)
                    .then(res => {
                        // update user info
                        this.getUserInfo();
                        this.loadFavourites();
                    }).catch(error => console.log(error.response));
            }
        }
    },
})