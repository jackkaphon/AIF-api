const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const auth = require('./routes/authentication')
const user = require('./routes/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(auth)
app.use(user)

app.get('/', (req, res) => {
    res.send("Hello AIF API")
})

app.listen(port)