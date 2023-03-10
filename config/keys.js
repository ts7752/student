//몽고DB 연결

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const cnn = await mongoose.connect(
      "mongodb+srv://LEE:qudtlssus12@cluster0.r6wajgp.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log(`MongoDB Connected: ${cnn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
