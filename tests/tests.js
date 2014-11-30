var globals = require(__dirname + '/../lib/config/globals'),
    db = require(__dirname + '/../lib/config/db')(globals),
    expect = require('expect.js');

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

describe('Database setup', function () {

    it('has admin user', function () {
        db.get('user:admin', function (err, value) {

            expect(value).to.be.an('object');
            expect(value.name).to.be(globals.admin.name);
            expect(value.password).to.be(globals.admin.password);
        });
    })
});

describe('Users', function () {

    var user = {
        name:     'john',
        password: 'dummy'
    };

    it('can get admin user', function () {

        db.users.get('admin', function (err, value) {

            expect(value.name).to.be(globals.admin.name);
            expect(value.password).to.be(globals.admin.password)
        });
    });

    it('can add a user', function () {

        db.users.set(user, function () {

            // check if user is added
            db.get('user' + user.name, function (err, value) {

                console.log(value);
                expect(value.name).to.be(user.name);
                expect(value.password).to.be(user.password);
            });

            // other way to test it
            db.users.get(user.name, function (err, value) {

                console.log(value);
                expect(value.name).to.be(user.name);
                expect(value.password).to.be(user.password);
            });
        });
    });

    it('can retrieve this new user', function () {

        db.users.get(user.name, function (err, value) {

            expect(value.name).to.be(globals.admin.name);
            expect(value.password).to.be(globals.admin.password)
        });
    });

    it('can delete a user', function () {

        db.users.del(user.name, function (err) {

            if (err)
                expect().fail();
            else
                db.users.get(user.name, function (err, value) {

                    if (!err)
                        expect.fail();
                });
        })
    })
});

//TODO: add tests with user formatting
//TODO: add test with reserved username ex admin
//TODO: add form test
//TODO: test if database is properly closed
