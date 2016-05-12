var express  = require("express");
var router   = express.Router();
var Question = require("../models/question");

router.get("/new", function(req, res, next) {
  res.render("questions/new", {errors: {}});
});
// Similar to Sinatra
// JS is asynchronus => need callbacks for order

router.post("/", function(req, res) {
  // console.log(req.body);
  // err object looks like:
  // errors:
  // { title: { [] } };
  var question = new Question({title: req.body.title,
                               body:  req.body.body});
  question.save(function(err, question) {
    if(err) {
      console.log(err);
      // res.end("failure");
      res.render("questions/new", {errors: err.errors});
    } else {
      console.log(question);
      res.redirect("/questions/" + question._id);
    }
  });
  // res.end("created!");
  // end for now to see that it works
});

router.get("/:id", function(req, res){
  Question.findOne({_id: req.params.id}, function(err, question) {
    if(err) {
      res.render("error", {message: "Question not found!",
                           error: {status: 404}});
    } else {
      res.render("questions/show", {question: question});
    }
  });
});

module.exports = router;
