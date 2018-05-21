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