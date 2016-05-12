## NodeJS Lecture (Thursday May 12th)
<hr>

For today's lecture we will be recreating our Awesome Answers application using NodeJS/Express

NodeJS is an environment in which to run JavaScript.

NodeJS runs on the V8 engine (same engine that powers Chrome) and is <em> faster </em> than Ruby. Javascript by nature is <em> asynchronus </em> whereas Ruby is <em> sequential </em>.

For example, let's look at a request with Rails.

Request 1 using `Rails`
1. Parse the data
2. Send the data to the database
  - Rails at this point is waiting while the data is sent to the database
  - It waits until the database has returned the data
  - This waiting time is known as <em> deadtime </em>
3. Rails then has to check the data
4. Then finally render or redirect

Let's say during the deadtime, there is another request (Request 2). Rails must wait until Request 1 has finished before it can begin Request 2.


Now let's examine this process using NodeJS/Express (Express is a NodeJS web framework)

Using the event loop and callbacks, NodeJS/Express will begin the second request (callback) when data is returned from the database

Request 1 using `NodeJS/Express`
1. Parse the data
2. Send the data to the database
  - During deadtime: Callback is scheduled and request 2 begins
3. Data checked
4. Render or redirect
  - Downside: Writing sequential code is simpler to write because once code is in the Event Loop, it's hard to determine when code is executed (order issues)

<hr>

We will be using Express JS as a framework (similar and inspired Sinatra)

The advantage of MongoDB is that it stores data as a BSON (binary JSON; giant hash)

Begin by installing the express framework

```bash
# terminal

npm install -g express
# No logger, templates etc, so we need the generator to help create those
npm install -g express-generator
express AwesomeAnswers
```

Let's examine `package.json`. Note that it looks exactly like a `Gemfile`. Rather than gems, these are called <em> modules </em>

- body-parser is used to parse HTML code.
- cookie-parser is used to parse cookies.
- debug is for debugging.
- jade is very similar to erb.
- morgan is for logging.
- serve-favicon is for the favorite icon.

Let's use `pug` instead of `jade` for now.

```bash
# terminal

cd AwesomeAnswers
# remove the jade line
npm install pug --save
# --save is to add it to our json package
```

Now looking in `app.js`

```js
// app.js => examining some of the lines

// Require is similar to Ruby => Note that these are not global in Ruby, must require in each file
// We need to manually require in each file that we need => This opens up to more customization and security (as opposed to Rails where everything is accessible everywhere)

// Think of "routes" as controllers => The routes were automatically generated

// app.set('views') is setting the views folder => main directory is views so we won't need to define that in our routes in methods later on
// app.set ('view engine') is the engine we want => change from jade to pug
app.set('view engine', 'pug');

// app.use are for our "middleware"
// Express uses a lot of "middleware" to handle a lot of basic actions. These "middleware" can be chained => pass other "middleware" as event handlers
// Think of middleware as "before actions" in Rails (note that Rails does a lot of these for us already)
app.use(logger('dev')); // Before => use logger
app.use(bodyParser.json()); // Before => parse the data as a JSON

// Example of how one of these "middleware" works
// Notice that this function is at the end => order matters! After it checks all the routes it will return a 404 not found error
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // req, res, next are more "middleware" as event handlers
  // next refers to the next middleware
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports(app);
```

Download the `pug` package for Atom and rename `.jade` files to `.pug`. Use the `Pug` syntax highlighting.

```js
// bin/www

// Change port from 3000 to 5000 so we can have a Rails project running at the same time
```

Then run `npm install` in the terminal to make sure everything is updated. Run `bin/www` in the terminal to start the server and head to `localhost:5000`

<hr>
ASIDE: This is seen used a lot in MEAN stack development: Meteor, Express, Angular, NodeJS

Mongo is faster than SQL and don't have to write SQL at all => very easy to deal with because it's a BSON

useful for certain scenarios (document stored database)
- if your website stores nicely in documents
- e.g. blog => blog post, title, comment on comments etc. but not a lot of associatons
- When an app has a lot of relationships => use relational database

<hr>

Create a file in `routes` called `questions.js`

```js
// question.js

var express = require("express");
// require here looks inside our node_modules folder to find express
var router = express.router();

router.get("/new", function(req, res, next) {
  res.end("Hello World!");
});
// Similar to Sinatra
// JS is asynchronus => need callbacks for order

module.exports = router;
// Every time we want to require a file in app.js it must have the exports at the end
```

Now to use the file we just generated, head back to `app.js`

```js
// app.js

var questions = require('./routes/questions');

// Order matters! Place after your other app.use("/"); lines
// Otherwise, the middleware used to parse JSON etc won't be called and your methods may return undefined items
app.use("/questions", questions);
```

Notice that to see the changes we need to restart the server. We'll use `nodemon` to get around this.

```bash
# terminal

npm install -g nodemon
```

From now on, we'll start our server with the command `nodemon bin/www`

Notice that in `question.js` we didn't need the full route of `/questions/new` to create the `/new` page. This is done automatically for us.

Now rather than just rendering text, let's render a page. Create the file `new.pug` in `/views/questions`

```pug
<!-- views/questions/new.pug -->

h1 New Questions
```

```js
// questions.js

router.get("/new", function(req, res, next) {
  res.render("questions/new");
});
```

If we want to use the application layout, we must have the line `extends ../layout` at the top of our code.
```pug
//- new.pug

extends ../layout

block content
  h1 New Question
  .col-md-6
    form.form-horizontal(action="/questions" method="POST")
      //- pug is space sensitive => don't need "end", all nesting is done through tab
      //- define <div class="form-group"> with just .form-group
      //- separate divs by simply making a new block;
      //- chain class with .class before, id with # before; tag must be first but the order doesn't matter
      //- adding a class to the overall form would be form.form-horizontal(action="")...
      .form-group
        label(for="title") Title
        input.form-control#title(type="text" name="title")
      .form-group
        label(for="body") Body
        textarea.form-control#body(name="body")
      .form-group
        label(for="submit")
        input.btn.btn-primary(type="submit" value="Create Question")
```

For now let's also add Bootstrap. For simplicity, let's use the CDN
```pug
//- layout.pug above the other link()

link(href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css", rel="stylesheet", integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7", crossorigin="anonymous")
```

Now clicking Create Question brings an error, so let's create that action and route.

```js
// questions.js

router.post("/", function(req, res) {
  console.log(req.body);
  res.end("created!");
  // end for now to see that it works
});
```

Now let's take this information and store it in MongoDB. We'll be using `Mongoose` for this.

```bash
# terminal

npm install mongoose --save
# Not a global install, we want it just for this project
```

Now we must connect to the MongoDB
```js
// app.js

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/AwesomeAnswers');
```

Now run MongoDB in the background
```bash
# terminal

mongod --config /usr/local/etc/mongod.conf &
```

Now let's create a folder called `models` with the file `question.js` inside.
```js
// models/question.js

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
```

Now to use this, we must require this file in our `/routes/question.js`
```js
// routes/questions.js

var Question = require("../models/question")

router.post("/", function(req, res) {
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
});
```

Let's now see how we can send errors.

```js
// routes/questions.js

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
    res.end("success");
  }
});
```

Then in our `pug` file:
```pug
.col-md-6
  form.form-horizontal(action="/questions" method="POST")
    .form-group(class=errors.title ? 'has-error' : '')
      label(for="title") Title
      input.form-control#title(type="text" name="title")
      if errors.title
        .help-block= errors.title
        //- the '=' must be touching to render the variable and not literal
```

Now we want to create a show page to display the question.

```js
// questions.js

router.post("/", function(req, res) {
  var question = new Question({title: req.body.title,
                               body:  req.body.body});
  question.save(function(err, question) {
    if(err) {
      console.log(err);
      res.render("questions/new", {errors: err.errors});
    } else {
      console.log(question);
      res.redirect("/questions/" + question._id);
    }
  });
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
```

Also create a file called `show.pug` in `views/questions`
```pug
//- views/questions/show.pug

extend ../layout

block content
  h1= question.title
  p= question.body
  //- the '=' must be touching to render the variable and not literal
```
