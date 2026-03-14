const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');
const errorHandle = require('./middlewares/errorHandle');
const conversationRoutes = require('./routes/conversationRoute'); 
const messageRoutes = require('./routes/messageRoute');



const app = express()



//middlewares
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);







//health check route
app.get('/health', (req, res) =>{
    res.json({status: 'Backend API is running'})
})

app.use(errorHandle);
module.exports = app;