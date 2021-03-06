var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require('mongoose');

var app = express();

// model
mongoose.connect('mongodb://localhost/my_database');

var Time = mongoose.model('FlexTimeEntry', new mongoose.Schema({
  date: String,
  hours: Number,
  desc: String,
  spent: Boolean
}));

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //app.set('views', path.join(application_root, "views"));
  //app.set('view engine', 'jade')
});

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/api/flex', function(req, res) {
  return Time.find(function(err, flex) {
    return res.send(flex);
  });
});

app.post('/api/flex', function(req, res) {
  var entry;
  console.log(req);
  if(!req.body.date || !req.body.hours)
    return res.send('Date or hours is missing', 500);
  entry = new Time({
    date: req.body.date,
    hours: req.body.hours,
    desc: req.body.description,
    spent: req.body.spent
  });

  entry.save(function(err) {
    if(!err) {
      return console.log("created");
    } else {
      console.log(err);
    }
  });
  return res.send(entry);
});

app.delete('/api/flex/:id', function(req, res){
  console.log("Delete: " +req);
  return Time.findById(req.params.id, function(err, flex){
    console.log("Flex: "+ flex);
    return flex.remove(function(err){
      if (!err) {
        console.log("Removed line");
        return res.send('');
      }
    });
  });
});

/*
app.get('/todo', function(req, res){
  res.render('todo', {title: "MongoDB Backed TODO App"});
});

app.get('/api/todos', function(req, res){
  return Todo.find(function(err, todos) {
    return res.send(todos);
  });
});

app.get('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    if (!err) {
      return res.send(todo);
    }
  });
});

app.put('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    todo.text = req.body.text;
    todo.done = req.body.done;
    todo.order = req.body.order;
    return todo.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(todo);
    });
  });
});

app.post('/api/todos', function(req, res){
  var todo;
  todo = new Todo({
    text: req.body.text,
    done: req.body.done,
    order: req.body.order
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(todo);
});

app.delete('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('')
      }
    });
  });
});
*/

app.listen(3000);
