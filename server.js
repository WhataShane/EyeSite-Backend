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

  async getImageAnalysis()
  {
    imageAnalysis = []
    const asyncGoogleCloudAnalysis = async GoogleCloudAnalysis(sourceImage[0])
    await asyncGoogleCloudAnalysis();
    return imageAnalysis;
  }

  res.send(sourceImage[0])
})



function GoogleCloudAnalysis (sourceImage) {



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
}


//,
//  {type: LANDMARK_DETECTION}, {type: LOGO_DETECTION},  {type: DOCUMENT_TEXT_DETECTION}, {type: IMAGE_PROPERTIES}
