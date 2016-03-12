var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.engine('html', require('ejs').renderFile);



app.get('/', function (req, res) {
  res.render('index.html', {name:"Bed"});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


app.get('/login', function (req, res) {
  res.end('logging you in');
});
