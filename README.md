# maju.app

[__maju.app__](https://maju.app)
is a web-app created to popularize the [majority judgement voting system](https://en.wikipedia.org/wiki/Majority_judgment)
by making it easily accessible.

## Install
In mongo shell: 
```
use maju;
db.createUser({user: "username", pwd: "password", roles: [{role: "readWrite", db: "maju"}]});
```
Then restart `mongod` with `--auth`

## Build Setup

``` bash
# install dependencies
$ yarn # Or yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Thanks
vuejs

nuxt

https://webdevchallenges.com/nuxt-js-internationalization-without-route-param/

