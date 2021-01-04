const express = require('express');
const connectDB = require('./config/db');

// This command will start the server.
const app = express();

// Connect to the Database.
connectDB();

// Initialize middleware, allowing us to read req.body.
app.use(express.json({ extended: false }));

// Check if the server is running.
app.get('/', (req, res) => res.send('API is running.'));

// Define routes.
app.use('/api/users', require('./routes/api/users'));

// Defines the port using environment variables, or selecting 5000 by default if none provided.
const PORT = process.env.PORT || 5000;

// Logs to the terminal that the server is now running.
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));