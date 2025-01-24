import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');

    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    await mongoose.connect(process.env.MONGODB_URI);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;