const app = require('./app');
const dotenv = require('dotenv');
const connectDb = require('./config/db')



//setting up config file
dotenv.config({path: './config/config.env'});


//connecting to the databas
connectDb();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`Health check: Backend Api is running`);
})  