var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//download express-validator from github
var expressValidator = require('express-validator')
// download mongojs from github
// fill in mongojs, custapp is the name of the db, users is the name of the mycollection
// this is done in terminal
var mongojs = require('mongojs')
var db = mongojs('custapp', ['users'])
var ObjectId = mongojs.ObjectId;

var app = express();

// var logger = function(req, res, next){
//   console.log('Logging...');
//   next();
// }
//
// app.use(logger);

//View engine, template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // specifie what folder you want to use for your views


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// global var for erros
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

// setting up express validator middleware
app.use(expressValidator({
  errorformatter: function(param, msg, value) {
    var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// 'get' send user what they are asking for to the page
app.get('/', function(req, res){
  // find everything
  db.users.find(function (err, docs) {
  	// docs is an array of all the documents in mycollection
    res.render('index', {
      title: 'cust',
      users: docs
    }); // takes from ejs file and send it to user
  })
  //res.send('hello world'); //takes from here and sends to the user
});

//the first arguement have to match with the action in 'form' in index.ejs
app.post('/users/add', function(req, res){
  // this checks the input to see if its empty
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  // if one of the check is empty the validation will be true and will be an error
  var errors = req.validationErrors();

  if(errors){
    res.render('index', {
      title: 'cust',
      users: users,
      errors: errors
    });
  }else{
    var newUsers = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      emai: req.body.email
    };
    // add customer to the db
    db.users.insert(newUsers, function(err, results){
      if(err){
        console.log(err);
      }
      // this brings us back the normal page 
      res.redirect('/');
    });
  }
});

//this deletes from the db matching the id
app.delete('/users/delete/:id', function(req,res){
  db.users.remove({_id: ObjectId(req.params.id)}, function(err, results){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, function(){
  console.log('server started on port 3000...');
});
