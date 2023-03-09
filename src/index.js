const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect("mongodb+srv://1234:1234@cluster0.effifom.mongodb.net/ContactForm?retryWrites=true&w=majority&ssl=true").then(()=>{
    console.log('connected to mongodb')
}).catch((error)=>{
    console.log(error)
})

app.listen('5000',()=>{
    console.log('server is up')
})