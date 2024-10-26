const express = require('express')
var cors = require('cors')
require("dotenv").config()
const mongoDBConnection = require('./config/dbConfig');

mongoDBConnection();

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.use('/api', require('./routes/userRoute'), require('./routes/communityRoute'),require('./routes/investmentRoute' ));


app.listen(port, () => {
  console.log(`Server start at http://localhost:${port}`)
})