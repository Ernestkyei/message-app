const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in config.env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Database is connected and running');
  } catch (error) {
    console.error('Database Connection Fail:', error.message);
    throw error; 
  }
};

module.exports = connectDB;