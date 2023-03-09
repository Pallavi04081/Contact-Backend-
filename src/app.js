const express = require("express")
const bodyParser = require('body-parser')
const Router = require("./Router/Routes")
const cors = require("cors")
const { urlencoded } = require("body-parser")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())



app.use("/",Router)

module.exports = app