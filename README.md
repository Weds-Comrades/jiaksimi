# Jiak-Simi

> Can't decide what to eat? Let us find food near your area!

## Set-up

### Prerequisites

1. WAMP or MAMP

1. Foursquare Developer Account

1. Google Cloud Platform Account

### Steps

1. Copy `app/env.example` and rename it to `app/env.js`

1. Replace all the empty strings in `env.js` with the respective api-keys you own.
    - [Foursquare](https://developer.foursquare.com)
    - [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key)

1. Start the app server on WAMP or MAMP

1. Load SQL file `server/db/jiaksimi.sql` into database

1. Navigate to `app/sites/env-check.html`

1. Ensure that all the alerts shown are green. If they are all green, you are good to go!

1. Open `app/sites/index.html` to start

### Passwords

|Username           |Password|
|:-----------------:|:-------------------|
|admin              |P@ssw0rd            |
