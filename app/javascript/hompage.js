Vue.component('card', {
    props: ['place'],
    template: `
    <div class="col-md-4 my-2">
        <div class="card">
            <div class="card-img">
                <img src='./images/bg-sg.jpg' class="card-img-top img-fluid">
            </div>
            <div class="card-body">
                <h6 class="card-title">{{ place.name }}</h6>
                <p class="card-distance">{{ place.location.distance }}m</p>
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
    created: async function () {
        function getVenues(pos) {
            // connect to the foursquare api
            // var obj = this;
            const currentLocation = pos
            var radius = 500;
            var limit = 4;
            const url = `https://api.foursquare.com/v2/venues/search?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20201020&ll=${currentLocation.lat},${currentLocation.long}&radius=${radius}&limit=${limit}&categoryId=4d4b7105d754a06374d81259`
            
            console.log(pos);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    obj.venues = JSON.parse(this.responseText).response.venues;
                }
            }
            xhr.open("GET", url, false);
            xhr.send();
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

        // main
        var obj = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, failure, {enableHighAccuracy:true, timeout:15000, maximumAge:30000})
        } else {
            console.log('Browser does not support location\nUsing defaults')
            getVenues(default_location)
        }
    },
});
// getLocationNearby();
