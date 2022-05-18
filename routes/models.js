const mongoose = require('mongoose');




  const bookSchema = new mongoose.Schema({
    title: {type:String,required:true},
    comments: Array
  });


const Book=mongoose.model('Book',bookSchema);


exports.Book=Book;