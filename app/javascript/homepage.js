var main = new Vue({
    el: '#main',
    data: {
        venues: [],

        // developers
        limit: 12,

        // required for foursquare apis
        currentPos: default_location,
        radius: default_filter.radius,
        user_tags: [],

        // filters
        filter_distance_list: [50, 100, 500, 1000],
        system_tags: [],
        query: '',

        // booleans
        is_venue_loaded: false,
        is_user_login: false,
        is_filter_card_active: false,

        // links for navbar
        links: {
            'home': './',
            'favourites': './sites/favourites.html',
            'settings': './sites/profile.html',
            'logout': './sites/logout.php',
            'split': './sites/bill_splitter.html',
            'login': './sites/login.php',
        },

        image: "",
    },
    mounted: async function() {
        await this.getAllTags();
        await this.getUserInfo();
        await this.getCurrentLocation()
            .then(position => {
                this.currentPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            }).catch(error => {
                console.log(error);
                console.log("An error occured. Using defaults");
            })

        await this.getVenues();
        
    },

    methods: {
        // get location of the browser using the geolocation
        // returns a promise containing the coordinates
        getCurrentLocation: async function() {
            var options = {
                enableHighAccuracy: true,
                timeout:15000,
                maximumAge:30000,
            }

            if (navigator.geolocation) {
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, options)
                });
            } else {
                return new Promise.reject(new Error("Browser does not support geolocation"));
            }
        },

        // call foursquare api and update venues
        getVenues: async function() {
            this.is_venue_loaded = false;
            var fetch_venue = [];
            var user_tags = this.user_tags.length === 0 ? [default_filter.uid_tag] : this.user_tags;
            var query = this.query.length !== 0 ? `&query=${this.query}` : '';
            const url = `https://api.foursquare.com/v2/venues/search?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20201020&ll=${this.currentPos.lat},${this.currentPos.lng}&radius=${this.radius}&limit=${this.limit}&categoryId=${user_tags.toString()}${query}`;

            // loop through get important data & image
            var venues = await axios.get(url)
                .then(response => {
                    return response.data.response.venues;  
                }).catch((error) => {return []});

            // get images
            for (const venue of venues) {
                const url_venue_details = `https://api.foursquare.com/v2/venues/${venue.id}?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20200928`
                var photo = await axios.get(url_venue_details)
                    .then(response => {
                        if (response.data.response.venue.bestPhoto !== undefined) {
                            var photo_raw = response.data.response.venue.bestPhoto;
                            return photo_raw.prefix + 'cap300' + photo_raw.suffix;
                        } else {
                            var photo_raw = response.data.response.venue.categories[0].icon;
                            return photo_raw.prefix + '512' + photo_raw.suffix;
                        }
                    });

                // dev purpose
                // var photo = "./images/bg/sg-1.jpg";

                // push to array
                fetch_venue.push({
                    id: venue.id,
                    name: venue.name,
                    distance: venue.location.distance,
                    photo: photo,
                    url: `./sites/map.html?id=${venue.id}&distance=${venue.location.distance}&currentPos=${this.currentPos.lat + ',' + this.currentPos.lng}&venuePos=${venue.location.lat + ',' +  venue.location.lng}`,
                });
            }
            this.venues = fetch_venue;
            this.is_venue_loaded = true;
        },

        // calls the DB and determines if user is login or not
        // if login, fill up the user details
        getUserInfo: async function() {
            await axios.get('../server/api/get-user-details.php')
                .then((res) => {
                    var user = res.data; 
                    this.is_user_login = true;

                    // the unique case where 0m distance is received
                    this.radius = user.filter.distance != null ? user.filter.distance : default_filter.radius;
                    this.radius = this.radius !== 0 ? this.radius : default_filter.radius;

                    this.user_tags = user.filter.tags;
                    this.image = "./images/profile/" + user.user.photo + ".png";
                })
                .catch(err => { console.log(err); });
        },

        // fetches all available tags in the server
        getAllTags: async function() {
            await axios.get('../server/api/get-tags.php')
                .then(res => {
                    this.system_tags = res.data.records
                }).catch(err => { console.log(err);});
        },

        // closes filter and calls getVenues when search btn is pressed
        search: async function() {
            // bootstrap collapse function
            $('#search-settings').collapse('hide');
            this.is_filter_card_active = false;
            await this.getVenues();
        },

        // save filter settings for signed in user
        // send a post request
        saveFilter: async function() {
            const params = new URLSearchParams();
            params.append('auth', true);
            params.append('distance', this.radius);
            params.append('tags', this.user_tags)

            await axios.post(
                '../server/api/update-filter.php',
                params,
            ).then(res => {
                //console.log(res)
            })
            .catch(error => console.log(error.response))

        },

        // reset defualts of filters
        resetFilter: async function() {
            this.user_tags = [];
            this.radius = 500;
        },
    },
    computed: {

    },
});
