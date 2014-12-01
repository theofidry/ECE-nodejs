var globals = require(__dirname + '/../lib/config/globals'),
    expect = require('expect.js');

describe('Test web app', function () {

    describe('Not logged in user', function () {

        it('can access access to not "auth" pages', function () {
            //TODO
        });

        it('cannot access to "auth" pages', function () {
            //TODO
        });

        describe('Login', function () {

            it('must provide valid credentials', function () {
                //TODO
            });

            it('can log in with user name', function () {
                //TODO
            });

            it('can log in with password', function () {
                //TODO
            });
        })
    });

    describe('Logged in user', function () {

        it('cannot access to log in page', function () {
            //TODO
        });

        it('can access to "auth" page', function () {
            //TODO
        });

        it('can log out', function () {
            //TODO
        });
    });

    //describe('express rest api server', function(){
//    var id
//
//    it('post object', function(done){
//        superagent.post('http://localhost:1337')
//            .send({ name: 'admin'
//                , password: 'admin'
//            })
//            .end(function(e,res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(res.body.length).to.eql(1)
//                expect(res.body[0]._id.length).to.eql(24)
//                id = res.body[0]._id
//                done()
//            })
//    })
//}
});

describe('Test database', function () {

    // Helper to load the database faster
    function getDb(globals, path) {
        return require(__dirname + '/../lib/config/db')(globals, path);
    }

    // Valid test database
    require(__dirname + '/../lib/config/db')(globals, __dirname + '/db');

    describe('Database loading', function () {

        var input = {
            emptyValues: [
                undefined,
                null,
                function () {},
                {},
                '',
                0,
                1,
                0.9,
                true,
                false
            ],

            validGlobals:   [
                {
                    name:     globals.name,
                    password: globals.password
                },
                {
                    name:     globals.name,
                    password: globals.password,
                    email:    'random@example.com'
                }
            ],
            invalidGlobals: [
                {
                    name: globals.name
                },
                {
                    password: globals.password,
                    email:    'random@example.com'
                }
            ]
        };

        describe('requires a valid globals and path', function () {

            it('return null if invalid globals', function () {
                //TODO
            });

            it('return null if valid globals without db attributes and invalid path', function () {
                //TODO
            });

            it('return something if valid globals with db attributes and invalid path', function () {
                //TODO
            });

            it('return something if valid globals without db attributes and valid path', function () {
                //TODO
            });

            it('return something if valid globals with db attributes and valid path', function () {
                //TODO
            });
        });
    });

    describe('Database setup', function () {

        it('has admin user', function () {
            //TODO
        })
    });

    describe('Users API', function () {

        describe('SET', function () {

            it('can add a new user', function () {
                //TODO
            });

            it('can update values of an existing user', function () {
                //TODO
            });

            it('cannot update values of admin user', function () {
                //TODO
            });

            it('can add new values to an existing user', function () {
                //TODO
            });

            it('cannot add new values to admin user', function () {
                //TODO
            });

            it('cannot add new values to non existing user', function () {
                //TODO
            });
        });

        describe('GET', function () {

            it('can get admin user', function () {
                //TODO
            });

            it('can get a user', function () {
                //TODO
            });

            it('can get a user property', function () {
                //TODO
            });
        });

        describe('DEL', function () {

            it('can delete a user', function () {
                //TODO
            });

            it('cannot delete admin user', function () {

            });
        });
    });

//
//    describe('Users', function () {
//
//        var user = {
//            name:     'john',
//            password: 'dummy'
//        };
//
//        it('can get admin user', function () {
//
//            db.users.get('admin', function (err, value) {
//
//                expect(value.name).to.be(globals.admin.name);
//                expect(value.password).to.be(globals.admin.password)
//            });
//        });
//
//        it('can add a user', function () {
//
//            db.users.set(user, function () {
//
//                // check if user is added
//                db.get('user' + user.name, function (err, value) {
//
//                    console.log(value);
//                    expect(value.name).to.be(user.name);
//                    expect(value.password).to.be(user.password);
//                });
//
//                // other way to test it
//                db.users.get(user.name, function (err, value) {
//
//                    console.log(value);
//                    expect(value.name).to.be(user.name);
//                    expect(value.password).to.be(user.password);
//                });
//            });
//        });
//
//        it('can retrieve this new user', function () {
//
//            db.users.get(user.name, function (err, value) {
//
//                expect(value.name).to.be(globals.admin.name);
//                expect(value.password).to.be(globals.admin.password)
//            });
//        });
//
//        it('can delete a user', function () {
//
//            db.users.del(user.name, function (err) {
//
//                if (err)
//                    expect().fail();
//                else
//                    db.users.get(user.name, function (err, value) {
//
//                        if (!err)
//                            expect.fail();
//                    });
//            })
//        })
//    });

//TODO: add tests with user formatting
//TODO: add test with reserved username ex admin
//TODO: add form test
//TODO: test if database is properly closed
});
