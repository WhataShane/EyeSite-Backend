require('dotenv').config()
var namer = require('color-namer')
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

app.post('/', async function (req, res) {
  var sourceImage = req.body.srcs
  imageAnalysis = await GoogleCloudAnalysis(sourceImage[0])
  res.send(imageAnalysis)
})

async function GoogleCloudAnalysis (sourceImage) {

  var imageAnalysis = []

  const result = await client.labelDetection(sourceImage)

  try {
  if ((result[0].labelAnnotations)[0].description) {
    var objects = []
    for (i = 0; i < 3; i++){
      objects.push((result[0].labelAnnotations)[i].description)
    }
    imageAnalysis.push({objects: objects})
  }} catch (error) {
   console.error(error);
  }

  const result2 = await client.faceDetection(sourceImage)
  try {
  var faces = result2[0].faceAnnotations

  var numberOfPeople = Object.keys(faces).length

  if (numberOfPeople > 0) {
    imageAnalysis.push({numberOfPeople: numberOfPeople})
  }

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
        if (numberOfHappyPeople > 0){
          imageAnalysis.push({numberOfHappyPeople: numberOfHappyPeople})
        }

        if (numberOfSadPeople > 0){
          imageAnalysis.push({numberOfSadPeople: numberOfSadPeople})
        }

        if (numberOfSurprisedPeople > 0){
          imageAnalysis.push({numberOfSurprisedPeople: numberOfSurprisedPeople})
        }

        if (numberOfAngeredPeople > 0){
          imageAnalysis.push({numberOfAngeredPeople: numberOfAngeredPeople})
        }

      }
    })} catch (error) {
     console.error(error);
    }


  const result3 = await client.landmarkDetection(sourceImage)
  try {
   if (result3[0].landmarkAnnotations[0]){
     imageAnalysis.push({nameOfLocation: result3[0].landmarkAnnotations[0].description})
   }} catch (error) {
    console.error(error);
   }

  const result4 = await client.logoDetection(sourceImage)
  try {
  if (result4[0].logoAnnotations[0]){
    imageAnalysis.push({nameOfLogo: result4[0].logoAnnotations[0].description})
  }} catch (error) {
   console.error(error);
  }

  const result5 = await client.documentTextDetection(sourceImage)
  try {
  if (result5[0].fullTextAnnotation){
    var text = result5[0].fullTextAnnotation.text
    var text1 = text.replace(/\n/g, " ")
    imageAnalysis.push({text: text1})
  }} catch (error) {
   console.error(error);
  }

  const result6 = await client.imageProperties(sourceImage)
  try {
  if (result6[0].imagePropertiesAnnotation) {
    colors = result6[0].imagePropertiesAnnotation.dominantColors.colors.slice(0, 2)
    var prominentColorNames = []

    for (i = 0; i < colors.length; i++){
      var rgb = "rgb("+colors[i].color.red+","+colors[i].color.green+","+colors[i].color.blue+")"
      var prominentColorsArray = namer(rgb)
      var prominentColor = prominentColorsArray.basic[0].name
      prominentColorNames.push(prominentColor)
    }

    if (prominentColorNames[0] === prominentColorNames[1]){
      imageAnalysis.push({color: prominentColorNames[0]})
    } else {
      imageAnalysis.push({color: prominentColorNames[0], color2: prominentColorNames[1]})
    }


  }} catch (error) {
   console.error(error);
  }

  return imageAnalysis
}
