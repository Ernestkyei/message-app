const express = require('express');
const cors = require('cors');


const app = express()

//middlewares
app.use(cors());
app.use(express.json());


//health check route
app.get('/health', (req, res) =>{
    res.json({status: 'Backend API is running'})
})


module.exports = app;