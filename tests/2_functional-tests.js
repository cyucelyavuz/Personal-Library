/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let createdId;
  this.beforeAll(done=>{
    chai.request(server)
        .post('/api/books')
        .type('form')
        .send({
          title:"example book",
        })
        .end((err,res)=>{
          if (err) console.log(err);
          else {
            createdId=res.body["_id"];
            done();
          }
        })
  })
  this.afterAll(done=>{
    chai.request(server)
        .delete('/api/books')
        .type('form')
        .send({
          _id:createdId
        })
        .end((err,res)=>{
          if (err) console.log(err);
          else done();
        })
  })
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
            .type('form')
            .send({
              title:"example book"
            })
            .end((err,res)=>{
                if (err) console.log(err);
                else{
               
                  assert.equal(res.status,200);
                  assert.isObject(res);
                  assert.equal(res.body["title"],"example book");
                  done();
                }
            })
       
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
            .post('/api/books')
            .type('form')
            .send({
              fuckUpProp:"d'oh!"
            })
            .end((err,res)=>{
              if(err) console.log(err);
              else{
                assert.equal(res.status,200);
                console.log(res.body);
                assert.equal(res.body,"missing required field title");
                done();
              }
            })
      });
      
    });


    suite('GET /api/books => array of books', function(){
    


      test('Test GET /api/books',  function(done){
        chai.request(server)
            .get('/api/books')
            .end((err,res)=>{
              const exampleBook= res.body.filter(elem=> elem["_id"]===createdId);
              assert.equal(res.status,200);
              assert.isArray(res.body);
              assert.property(res.body[0],'commentcount');
              assert.property(res.body[0],"_id");
              assert.property(res.body[0],"title");
              assert.equal(exampleBook[0]["title"],"example book");
              done();
            })

      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
            .get('/api/books/'+6666666)
            .end((err,res)=>{
              if(err) console.log(err);
              else{
                assert.equal(res.status,200);
                assert.equal(res.body,"no book exists");
              }
              done();
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
            .get('/api/books/'+createdId)
            .end((err,res)=>{
              if (err) console.log(err);
              else{
                
                
                assert.equal(res.status,200);
                assert.isObject(res.body);
                assert.equal(res.body.title,"example book");
                
              }
              done();
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
            .post('/api/books/'+createdId)
            .type('form')
            .send({
              comment:"test comment"
            })
            .end((err,res)=>{
              if (err) console.log(err);
              else{
                assert.equal(res.status,200);
                assert.isObject(res.body);
                assert.isArray(res.body["comments"]);
                assert.include(res.body["comments"],"test comment");
              }
              done();
            })
          
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/'+createdId)
        .type('form')
        .send({
          fuckUpProp:"test comment"
        })
        .end((err,res)=>{
          if (err) console.log(err);
          else{
            assert.equal(res.status,200);
            assert.isString(res.body);
            assert.equal(res.body,"missing required field comment");
            
          }
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/'+666)
        .type('form')
        .send({
          comment:"test comment"
        })
        .end((err,res)=>{
          if (err) console.log(err);
          else{
            assert.equal(res.status,200);
            assert.isString(res.body);
            assert.equal(res.body,'no book exists');
            
          }
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
            .delete('/api/books/'+createdId)
            .end((err,res)=>{
              if (err) console.log(err);
              else {
                assert.equal(res.status,200);
                assert.equal(res.body,'delete successful');
              }
              done();
            })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
            .delete('/api/books/'+666)
            .end((err,res)=>{
              if (err) console.log(err);
              else {
                assert.equal(res.status,200);
                assert.equal(res.body,'no book exists');
              }
              done();
            })
      });

    });

  });

});
