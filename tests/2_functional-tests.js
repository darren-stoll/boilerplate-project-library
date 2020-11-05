/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'The tested title'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'The tested title');
            assert.isArray(res.body.comments);
            done();
          });
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''
          })
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.message, 'missing book title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        var id = "1234567890ab"
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function(err, res){
            console.log(res.status);
            assert.equal(res.status, 400);
            assert.equal(res.body.message, 'id not found')
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'This title is new for testing'
          })
          .end((err, res) => {
            var id = res.body._id;
            chai.request(server)
              .get(`/api/books/${id}`)
              .end((error, response) => {
                assert.equal(response.status, 200);
                assert.equal(response.body.title, 'This title is new for testing');
                done();
              })
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'This title will have a comment'
          })
          .end((err, res) => {
            var id = res.body._id;
            chai.request(server)
              .post(`/api/books/${id}`)
              .send({
                comment: "This is the comment"
              })
              .end((error, response) => {
                assert.equal(response.status, 200);
                assert.equal(response.body.title, 'This title will have a comment');
                assert.equal(response.body.comments[0], "This is the comment");
                assert.isArray(response.body.comments);
                done();
              })
          })
        
      });
      
    });

  });

});
