Vue.component('navbar', {
    props: ['is-login'],
    template: `
    <nav class="navbar navbar-dark bg-dark sticky-top nav">
        <ul class="list-unstyled">
            <li class="nav-item">
                <a class="nav-link" href="#">Bill Splitter</a>
            </li>
        </ul>

        <button v-if="!isLogin" class="btn btn-light">
            Login
        </button>

        <div v-else class="dropdown">
            <button class="btn round-dropdown" id="dropdownMenuButton" type="button" data-toggle="dropdown"></button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item links" href="./">
                    <i class="material-icons">local_dining</i>
                    <span class="dropdown-text">Food Around You</span>
                </a>
                <a class="dropdown-item links" href="./sites/favourites.html">
                    <i class="material-icons">favorite</i>
                    <span class="dropdown-text">Favourites</span>
                </a>
                <a class="dropdown-item links" href="#">
                    <i class="material-icons">settings</i>
                    <span class="dropdown-text">Account Settings</span>
                </a>
                <a class="dropdown-item links" href="#">
                    <i class="material-icons">exit_to_app</i>
                    <span class="dropdown-text">Logout</span>
                </a>
            </div>
        </div>
    </nav>
    `,
})