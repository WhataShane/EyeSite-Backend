require('dotenv').config()
var vision = require('@google-cloud/vision');
client = new vision.ImageAnnotatorClient();

var express = require('express')
var app = express()

app.use(express.json())
app.use(express.urlencoded())

const PORT = process.env.PORT || 3000;

app.listen(PORT)

app.get('/', function (req, res) {
  res.send("You're not supposed to be here!")
})

app.post('/', function (req, res) {
  var sourceImage = req.body.srcs


  client.labelDetection(sourceImage[0])
  .then(function(results) {
    var labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  })
  .catch(function(err) {
    console.error('ERROR:', err);
  });

  res.send(sourceImage[0])


})
