/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config();

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = function (app) {

  var bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String]
  })

  const Book = mongoose.model("Book", bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({},(err, data) => {
        if (err) console.log(err);
        else {
          var dataArray = [];
          data.map(e => {
            var objToPush = {};
            objToPush._id = e._id;
            objToPush.title = e.title;
            objToPush.commentcount = e.comments.length;
            dataArray.push(objToPush);
          })
          res.json(dataArray);
        }
      })
    })
    
    .post(async (req, res) => {
      try {
        var title = req.body.title;
        //response will contain new book object including atleast _id and title
        var newBook = new Book({
          title: title,
          comments: []
        });
        var newBookData = await newBook.save();
        res.json({
          _id: newBookData._id,
          title: newBookData.title,
          comments: newBookData.comments
        })
      } catch (err) {
        console.log(err);
        res.status(400).send({code: 400, message: 'missing book title'});
      }
    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      Book.remove({}, (err, data) => {
        if (err) {
          console.log(err);
          res.json("Error in deleting: ", err);
        }
        else res.json('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, data) => {
        if (err) {
          console.log(err);
          res.status(400).send({code: 400, message: 'invalid id'});
        } else if (!data) {
          res.status(400).send({code: 400, message: "id not found"});

        } else {
          res.json(data);
        }
      })
    })
    
    .post((req, res) => {
      try {
        var bookid = req.params.id;
        var comment = req.body.comment;
        //json res format same as .get
        Book.findById(bookid, async (err, data) => {
          if (err) console.log(err);
          data.comments.push(comment);
          var updatedBookData = await data.save();
          res.json(updatedBookData);
        })
        
      } catch (err) {
        console.log(err);
        res.status(400).send({code: 400, message: 'missing field'});
      }
      

    })
    
    .delete(async (req, res) => {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        await Book.findByIdAndDelete(bookid);
        res.json('complete delete successful');
      } catch (err) {
        console.log(err);
        res.status(400).send({code: 400, message: 'invalid id'});
      }
    });
  
};
