Vue.component('navbar', {
    props: ['is-login', 'links'],
    template: `
    <nav class="navbar navbar-dark bg-dark sticky-top nav">
        <ul class="list-unstyled">
            <li class="nav-item">
                <a class="nav-link" v-bind:href="links.split">Bill Splitter</a>
            </li>
        </ul>

        <a v-if="!isLogin" v-bind:href="links.login" class="btn btn-light">
            Login
        </a>

        <div v-else class="dropdown">
            <button class="btn round-dropdown" id="dropdownMenuButton" type="button" data-toggle="dropdown"></button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item links" v-bind:href="links.home">
                    <i class="material-icons">local_dining</i>
                    <span class="dropdown-text">Food Around You</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.favourites">
                    <i class="material-icons">favorite</i>
                    <span class="dropdown-text">Favourites</span>
                </a>
                <a class="dropdown-item links" v-bind:href="links.settings">
                    <i class="material-icons">settings</i>
                    <span class="dropdown-text">Account Settings</span>
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