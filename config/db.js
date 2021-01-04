const mongoose = require('mongoose');
const config = require('config');
const database = config.get('mongoURI');

const connectDB = async () => {
  try {
    // Await connection to database through the URI provided.
    await mongoose.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('Database is connected.');
  } catch (error) {
    console.error(error.message);
    // Exit the application process with a 'failure'.
    process.exit(1);
  }
}

module.exports = connectDB;