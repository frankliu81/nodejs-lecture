var express  = require("express");
var router   = express.Router();
var Question = require("../models/question");

router.get("/new", function(req, res, next) {
  res.render("questions/new");
});
// Similar to Sinatra
// JS is asynchronus => need callbacks for order

router.post("/", function(req, res) {
  // console.log(req.body);
  var question = new Question({title: req.body.title,
                               body:  req.body.body});
  question.save(function(err, question) {
    if(err) {
      console.log(err);
      res.end("failure");
    } else {
      console.log(question);
      res.end("success");
    }
  });
  // res.end("created!");
  // end for now to see that it works
});

module.exports = router;
