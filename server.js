require('dotenv').config()
var vision = require('@google-cloud/vision')
client = new vision.ImageAnnotatorClient()

var express = require('express')
var app = express()

app.use(express.json())
app.use(express.urlencoded())

const PORT = process.env.PORT || 3000

app.listen(PORT)

app.get('/', function (req, res) {
  res.send("You're not supposed to be here!")
})

app.post('/', function (req, res) {
  var sourceImage = req.body.srcs
  GoogleCloudAnalysis(sourceImage[0])

  res.send(sourceImage[0])
})

app.post('/', function (req, res) {
 var sourceImage = req.body.srcs
 imageAnalysis = []
 GoogleCloudAnalysis(sourceImage[0], function(result){
   res.send(result)
 })
})

function GoogleCloudAnalysis (sourceImage, callback) {

  var imageAnalysis = []

  client.labelDetection(sourceImage)
  .then(function(results) {
    var labels = results[0].labelAnnotations
    var objects = []
    for (i = 0; i < 2; i++){
      objects.push(labels[i].description)
    }
    imageAnalysis.push({objects: objects})
  })
  .catch(function(err) {
    console.error('ERROR:', err)
  })

  .then(function(results){

    client.faceDetection(sourceImage)
    .then(function(results) {
      var faces = results[0].faceAnnotations

     imageAnalysis.push({numberOfPeople: Object.keys(faces).length})

      var numberOfHappyPeople = 0
      var numberOfSadPeople = 0
      var numberOfSurprisedPeople = 0
      var numberOfAngeredPeople = 0
      var facesProcessed = 0;

      faces.forEach(function(face) {

        if (face.joyLikelihood === "VERY_LIKELY") {
          numberOfHappyPeople += 1
        }

        if (face.sorrowLikelihood === "VERY_LIKELY") {
          numberOfSadPeople += 1
        }

        if (face.surpriseLikelihood === "VERY_LIKELY") {
          numberOfSurprisedPeople += 1
        }

        if (face.angerLikelihood === "VERY_LIKELY") {
          numberOfAngeredPeople += 1
        }

        facesProcessed += 1
        if (facesProcessed === faces.length) {
          imageAnalysis.push({numberOfHappyPeople: numberOfHappyPeople})
          imageAnalysis.push({numberOfSadPeople: numberOfSadPeople})
          imageAnalysis.push({numberOfSurprisedPeople: numberOfSurprisedPeople})
          imageAnalysis.push({numberOfAngeredPeople: numberOfAngeredPeople})
        }
      })
    })
    .catch(function(err) {
      console.error('ERROR:', err)
    })

    .then(function(results){
      console.log(imageAnalysis)
      callback(imageAnalysis)
    })

  }
  )





  client.landmarkDetection(sourceImage)
  .then(function(results) {
   if (results[0].landmarkAnnotations[0]){
     imageAnalysis.push({nameOfLocation: results[0].landmarkAnnotations[0].description})
   }
  })
  .catch(function(err) {
    console.error('ERROR:', err)
  })

  client.logoDetection(sourceImage)
  .then(function(results) {
   if (results[0].logoAnnotations[0]){
     imageAnalysis.push({nameOfLogo: results[0].logoAnnotations[0].description})
   }
  })
  .catch(function(err) {
    console.error('ERROR:', err)
  })

//WIP vvv
  client.documentTextDetection(sourceImage)
  .then(function(results) {
   if (results[0]){

   }
  })
  .catch(function(err) {
    console.error('ERROR:', err)
  })

  client.imageProperties(sourceImage)
  .then(function(results) {
   if (results[0]){
  //   console.log(results)
   }
  })
  .catch(function(err) {
    console.error('ERROR:', err)
  })


}
