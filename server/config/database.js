import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    throw Error(error);
  }
};

export default connectDB;
