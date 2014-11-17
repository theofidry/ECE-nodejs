# ECE Project

This is a simple node.js project for the Asynchronous Server Technologies course at ECE Paris.

Technology used:

* [Express.js](http://expressjs.com/)
* [Grunt](http://gruntjs.com/)
* [Node.js & npm](http://nodejs.org/)
* [JADE](http://jade-lang.com/)

# Project

Do a login page using the framework Express.js and JADE template engine.

## Architecture

```
.
├── bin                   # executables
|   └── start.js          # start the application
├── lib                   # core components
|   └── app.js            # main file of the application
├── public                # web root
└── views
    ├── styl              # Stylus stylesheets
    |   └── app.styl      # main Stylus stylesheet
    └── tpl               # JADE templates
```

## Install

Clone this project.

Install [node.js](http://nodejs.org/). Then install the project dependencies:
```bash
npm install
```

Publish assets:
```bash
grunt publish
```

Choose the port or the host to which the application listen, change the line 5 of ``bin/start.js``. Otherwise the default configuration is used which is ``localhost``for the host and ``1337``for the port.


## Update

Update the project:
```bash
npm update
```

For development purpose, install the development dependencies:
```bash
npm update --save-dev
```

## Grunt tasks

### Publish assets

```bash
// CSS
grunt css       // prod
grunt css-dev   // dev

// Everything
grunt publish   // prod
grunt build     // dev
```

### Watch task
```bash
grunt watch
```

# Contributors

* [Estelle LATRONICO](https://github/Estellou)
* [Théo FIDRY](https://github.com/theofidry)

# License
 
Copyright © 2014, [Théo FIDRY](https://github.com/theofidry), ISC License.
