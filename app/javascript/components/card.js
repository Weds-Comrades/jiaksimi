Vue.component('card', {
  props: ['place'],
  template: `
  <div class="col-md-4 my-2">
        <a class="card" v-bind:href="place.url" v-if="'distance' in place">
            <div class="card-img">
                <img v-bind:src="place.photo"  class="card-img-top img-fluid">
            </div>
            <div class="card-body">
                    <h6 class="card-title">{{ place.name }}</h6>
                    <p class="card-distance">
                        {{ place.distance }}m
                    </p>
            </div>
        </a>

        <div v-else class="card">
            <div class="card-img">
                <img v-bind:src="place.photo"  class="card-img-top img-fluid">
            </div>
            <div class="card-body">
                <h6 class="card-title">{{ place.name }}</h6>
            </div>
        </div>
  </div>
  `,

});