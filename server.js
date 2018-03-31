var express = require('express')
var app = express()

app.use(express.json())
app.use(express.urlencoded())

app.listen(4000)

app.post('/', function (req, res) {
  var sourceImage = req.body.srcs
  console.log(sourceImage[0])

})
