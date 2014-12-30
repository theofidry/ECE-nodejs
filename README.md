# ECE Project

This is a simple node.js project for the Asynchronous Server Technologies course at ECE Paris.

Technology used:

* [Express.js](http://expressjs.com/)
* [Grunt](http://gruntjs.com/)
* [Node.js & npm](http://nodejs.org/)
* [JADE](http://jade-lang.com/)
* [Stylus](http://learnboost.github.io/stylus/)
* [LevelDB](https://github.com/google/leveldb)

Travis CI build status:

[![Build Status](https://travis-ci.org/theofidry/nodejs-ECEProject.svg?branch=master)](https://travis-ci.org/theofidry/nodejs-ECEProject)

Demo on OpenShift: [link](http://nodejs-eceproject.rhcloud.com/)

# Project

Do a login page using the framework Express.js and JADE template engine.


## Getting started

Clone this project:
```bash
git clone https://github.com/theofidry/nodejs-ECEProject.git
```

Install [node.js](http://nodejs.org/). Then install the project dependencies:
```bash
npm install
```

Install [Grunt](http://gruntjs.com/):
```bash
npm install -g grunt
```

Publish assets:
```bash
grunt publish
```

Start app:
```bash
npm start
```

Default admin user: `admin` or `admin@example.com` | `admin`

If you wish to change the port the app is running on, just change them in the `bin/start.js` file. The default admin
user may be changed in `lib/config/globals.js`.


# More

If you wish to have more info on the layout or on the dev environment (ex: Grunt tasks), check the [wiki](https://github.com/theofidry/nodejs-ECEProject/wiki)!

# Contributors

* [Estelle LATRONICO](https://github/Estellou)
* [Théo FIDRY](https://github.com/theofidry)

# License
 
Copyright © 2014, [Théo FIDRY](https://github.com/theofidry), ISC License.
