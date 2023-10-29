//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Something";
const app = express();
const aboutContent = "  About Login";
const contactContent = "This is Sign Up";

const currentDate = new Date();

const cdate = currentDate.getDate();
const cmonth = currentDate.getMonth();
const cyear = currentDate.getFullYear();

const datetoday = cyear+ '-' + cmonth + '-' + cdate;


const postSchema = {

 title: String,

 content: String,
 
 date : String

};

const Post = mongoose.model("Post", postSchema);

mongoose.connect("mongodb+srv://manoj2002:chaudharimanoj@cluster0.fbq66ae.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//let posts = [];

app.get("/", function(req, res){
    Post.find({}, function(err, posts){

       res.render("home", {

         posts: posts
         });

     })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
  
  title: req.body.postTitle,

  content: req.body.postBody,

  date : datetoday

});

post.save(function(err){

if (!err){

  res.redirect("/");

}
});

});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      date: new Date().toDateString(),
      title: post.title,
      content: post.content
    });
  });

});

app.get("/delete/:postId",function(req,res){
  const requestedPostId = req.params.postId;
  Post.deleteOne({ _id: requestedPostId }, function (err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
