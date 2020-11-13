Vue.component('navbar', {
    props: {
        'is-login': {
            type: Boolean,
            default: false,
        },
        'links': {
            type: Object,
            required: true,
        },
        "image": {
            type: String,
            default: '../images/profile/cat.png',
        }
    },
    template: `
    <nav class="navbar navbar-dark bg-dark sticky-top nav">
        <a v-if="!isLogin" v-bind:href="links.login" class="btn btn-light">
            Login
        </a>

        <div v-else class="dropdown">
            <button class="btn round-dropdown" :style="{'background-image': 'url(' + image + ')'}" id="dropdownMenuButton" type="button" data-toggle="dropdown"></button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item links" v-bind:href="links.home">
                    <i class="material-icons">local_dining</i>
                    <span class="dropdown-text">Food Around You</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.favourites">
                    <i class="material-icons">favorite</i>
                    <span class="dropdown-text">Favourites</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.split">
                    <i class="material-icons">account_balance</i>
                    <span class="dropdown-text">Split Bills</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.settings">
                    <i class="material-icons">person</i>
                    <span class="dropdown-text">Profile</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.logout">
                    <i class="material-icons">exit_to_app</i>
                    <span class="dropdown-text">Logout</span>
                </a>
            </div>
        </div>
    </nav>
    `,
})