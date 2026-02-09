const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const errorHandle = require('./middlewares/errorHandle');


const app = express()



//middlewares
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)








//health check route
app.get('/health', (req, res) =>{
    res.json({status: 'Backend API is running'})
})

app.use(errorHandle);


module.exports = app;