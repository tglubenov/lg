const morgan = require('morgan');

var express = require('express');
var app = express();
var hbs = require('hbs');

hbs.registerPartials('views/partials');
app.set('view engine', 'hbs');

var path = require('path');
var server = require('http').createServer(app);
var axios = require('axios');
var querystring = require('querystring');

require('dotenv').config();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );

app.use(express.static('public'));
app.use(express.static('files'));

app.get('/', function(req, res) {
//  res.sendFile(path.join(__dirname + '/init_leaflet.html'));
  res.sendFile(path.join(__dirname + '/init_map_v201808.html'));
});

app.get('/chart', function (req, res) {
  res.sendFile(path.join(__dirname + '/chart.html'));
})

const mongoose = require('mongoose');

// Mongoose conn to mongodb mlab db
mongoose.connect('mongodb://lg:TGL2018!!@ds247141.mlab.com:47141/lg_dev', function (error) {
  if (error) {
    console.log(error);
  }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
  name: String,
  type: Schema.Types.Mixed
});

// Mongoose Model definition
var Json = mongoose.model('JString', JsonSchema, 'lgs');

console.log(Json);

/* GET layers json data. */
app.get('/lgdata', function (req, res) {
  Json.find({},{'properties':'','type': '', 'geometry': ''}).sort('-properties.receive_timestamp').limit(2).exec(function (err, docs) {
    //console.log(docs);
    res.json(docs);
  });
});

app.get('/timeseries', function (req, res) {
  Json.find({'properties.lat': 28.08228888888889,'properties.lon': 43.36878055555555},{'properties.receive_timestamp':'', 'properties.PD':''}).sort('-properties.receive_timestamp').limit(25).exec(function (err, docs) {
//    console.log(docs);
    res.json(docs);
  });
});

app.get('/timeseries_var', function (req, res) {
  Json.find({'properties.lat': 43.20978055555556,'properties.lon': 27.91121111111111},{'properties.receive_timestamp':'', 'properties.PD':''}).sort('-properties.receive_timestamp').limit(25).exec(function (err, docs) {
//    console.log(docs);
    res.json(docs);
  });
});


app.get('/last5', (req, res) => {
  Json.find({}, {'properties':'','type': '', 'geometry': ''}).sort('-properties.receive_timestamp').limit(5).exec((err, docs) => {
    res.json(docs);
  });

});

app.get('/lgdata/:date', (req, res) => {
  Json.find({}, {})
});

app.get('/lgdata/:err', (req, res) => {

});

app.get('/map', (req, res) => {
  res.render('index', {'title': 'Светлинни Пътеки проект'});
});

// Async axios var for accessing web resources
//var instance = axios.create({
//   baseURL: 'https://api.imgur.com/3/',
//   headers: { 'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_ID }
// });

// get search API point based on axios resource
// app.get('/search/:query', function(req, res) {
//   const url = 'gallery/search/top/0/?' + querystring.stringify({ q: req.params.query });
//   instance.get(url)
//     .then(function (result) {
//       res.send(result.data.data.filter(item => !item.is_album && !item.nsfw && !item.animated));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });


app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
  require('reload')(server, app);
}

server.listen(process.env.PORT, function () {
  console.log('Listening on port '.concat(process.env.PORT))
});
