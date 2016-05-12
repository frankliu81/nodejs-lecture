var express = require("express");
var router = express.Router();

router.get("/new", function(req, res, next) {
  res.end("Hello World!");
});
// Similar to Sinatra
// JS is asynchronus => need callbacks for order

module.exports = router;
