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

    it('has admin user', function() {
        db.get('admin', function(err, value) {

            expect(value).to.be.an('object');
            expect(value.name).to.be.be(globals.admin.name);
            expect(value.password).to.be.be(globals.admin.password);
        });
    })
});

describe('Users', function () {

    it('post object', function (done) {
        superagent.post('http://localhost:1337')
            .send({ name: 'admin', password: 'admin'
            })
            .end(function (e, res) {
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(res.body.length).to.eql(1)
                expect(res.body[0]._id.length).to.eql(24)
                id = res.body[0]._id
                done()
            })
    })
});
