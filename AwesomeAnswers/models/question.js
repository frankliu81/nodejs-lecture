var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    // we can use a ',' instead of typing var multiple times

// QuestionSchema is capitalized so we treat it as a class
// Define a Schema to tell us what kind of data we want to have
var QuestionSchema = new Schema({
  title: {type: String, required: true},
  body:  {type: String}
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
