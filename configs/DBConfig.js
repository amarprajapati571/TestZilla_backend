import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "tyarizilla"
    }
    await mongoose.connect(DATABASE_URL, DB_OPTIONS).then(()=>{
        
    }).catch;
    console.log('Connected Successfully...')
  } catch (error) {
    console.log(error)
  }

}

export default connectDB