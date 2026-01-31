const mongoose = require('mongoose');


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database is connected and runnning');

    }catch(error){
        console.log('Database Connection Fail');
        process.exit(1);

    }
}

module.exports = connectDB;
