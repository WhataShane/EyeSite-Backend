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

app.post('/', function async (req, res) {
  var sourceImage = req.body.srcs
  imageAnalysis = await GoogleCloudAnalysis(sourceImage[0])
  res.send(imageAnalysis)
})

async function GoogleCloudAnalysis (sourceImage) {

  var imageAnalysis = []

  const result = await client.labelDetection(sourceImage) {
    var labels = results[0].labelAnnotations
    var objects = []
    for (i = 0; i < 2; i++){
      objects.push(labels[i].description)
    }
    imageAnalysis.push({objects: objects})
  }


  const result2 = await client.faceDetection(sourceImage) {
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
  }

  const result3 = await client.landmarkDetection(sourceImage){
   if (results[0].landmarkAnnotations[0]){
     imageAnalysis.push({nameOfLocation: results[0].landmarkAnnotations[0].description})
   }
  }


  const result4 = await client.logoDetection(sourceImage) {
   if (results[0].logoAnnotations[0]){
     imageAnalysis.push({nameOfLogo: results[0].logoAnnotations[0].description})
   }
  }

//WIP vvv
  const result5 = await client.documentTextDetection(sourceImage) {
   if (results[0]){

   }
  }

  const result6 = await client.imageProperties(sourceImage) {
   if (results[0]){
  //   console.log(results)
   }
  }

  return imageAnalysis

}
