const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Determine which database to use based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Use the appropriate connection string
    let mongoURI;
    if (isProduction) {
      mongoURI = process.env.MONGO_URI_PROD || process.env.MONGO_URI;
      console.log('🔐 Connecting to PRODUCTION database (MongoDB Atlas)');
    } else {
      mongoURI = process.env.MONGO_URI_DEV || process.env.MONGO_URI;
      console.log('💻 Connecting to DEVELOPMENT database (Local MongoDB)');
    }
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined. Check your environment variables.');
    }

    await mongoose.connect(mongoURI);

    console.log('✅ Database connected successfully');
    console.log(`📊 Database: ${isProduction ? 'MongoDB Atlas (Production)' : 'Local MongoDB (Development)'}`);
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;