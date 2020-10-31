Vue.component('card', {
    props: ['place'],
    template: `
    <div class="col-md-4 my-2">
        <div class="card">
            <div class="card-img">
                <img v-bind:src="place.photo"  class="card-img-top img-fluid">
            </div>
            <div class="card-body">
                <h6 class="card-title">{{ place.name }}</h6>
                <p class="card-distance">{{ place.distance }}m</p>
            </div>
        </div>
    </div>
    `
});

// main()
var card_container = new Vue({
    el: '#card-container',
    data: {
        venues: [],
    },
    mounted: function () {
        async function getVenues(pos) {
            // connect to the foursquare api
            const currentLocation = pos
            var radius = 500;
            var limit = 4;
            const url = `https://api.foursquare.com/v2/venues/search?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20201020&ll=${currentLocation.lat},${currentLocation.long}&radius=${radius}&limit=${limit}&categoryId=4d4b7105d754a06374d81259`

            // loop through get important data & image
            var venues = await axios.get(url)
                .then(response => {
                    return response.data.response.venues;  
                });
           
            // get images
            for (const venue of venues) {
                const url_venue_details = `https://api.foursquare.com/v2/venues/${venue.id}?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20200928`
                var photo = await axios.get(url_venue_details)
                    .then(response => {
                        var photo_raw = response.data.response.venue.bestPhoto;
                        return photo_raw.prefix + 'cap300' + photo_raw.suffix;
                    });

                // push to array
                obj.venues.push({
                    id: venue.id,
                    name: venue.name,
                    distance: venue.location.distance,
                    photo: photo,
                });
            }
        }

        function success(position) {
            getVenues({
                lat:  position.coords.latitude,
                long: position.coords.longitude,
            });
        };

        function failure() {
            console.log("Unable to retrieve location\nUsing defaults");
            getVenues(default_location);
        }

        // main method
        var obj = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, failure, {enableHighAccuracy:true, timeout:15000, maximumAge:30000})
        } else {
            console.log('Browser does not support location\nUsing defaults')
            getVenues(default_location)
        }
    },
});
