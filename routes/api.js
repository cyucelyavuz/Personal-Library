/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';


const Book=require('./models').Book;
module.exports = function (app,db) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     
     const books = await Book.find({});
     res.json(
       books.map(elem=>({
        "_id":elem._id,
        "title":elem.title,
        "commentcount":elem.comments.length
       }))
     );
     
     
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if (!title) res.send('missing required field title');
      else {
      const book = new Book({
        title:title
      });
      console.log(book);
      try{
        book.save((err,data)=>{
          if (err) console.log('error saving book')
          
          else {
            //console.log('book saved '+data);
            res.json({
              _id:data._id,
              title:data.title

            });
          }
        });
        
      }catch(e){
        res.status(500).send(e);
      }
    }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try{
       await Book.deleteMany({});
       
       res.status(200)
          .json("complete delete successful");
      } catch(e){
        res.json(e);
      }
      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid,(err,doc)=>{
        if(!doc) res.send('no book exists');
        else {
          res.json(doc);
        }
      })
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      //json res format same as .get

      if(!comment) res.send('missing required field comment');
      else {
      Book.findById(bookid,(err,doc)=>{
        if (!doc) res.send('no book exists');
        else {
          doc.comments.push(comment);
          doc.save((err,doc)=>{
            if(err) console.log(err)
            else res.json(doc);
          });
          
        }
      })
    }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({_id:bookid},(err,doc)=>{
        if (!doc) res.send('no book exists');
        else res.send('delete successful');
      })
    });
  
};
