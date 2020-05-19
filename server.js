// Bring in express, mongoose, body-parser, and passport
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Bring in the routes
const group = require('./routes/api/group');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');

// Settings to avoid mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

// New express application
const app = express();

// Body parser middleware, allows us to parse incoming request bodies.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuration for the database
const db = require('./config/keys').mongoURI;

// Connect to MongoDB using Mongoose
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Database Connected'))
  .catch((err) => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Routes
app.use('/api/group', group);
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

/*
  Create a variable port so when the application is deployed it can run on the server's port
  and when it is not deployed it runs on port 5000
*/
const port = process.env.PORT || 5000;

// Listen for a connection on the port constant and log that it is in fact running.
app.listen(port, () => console.log(`Server running on port ${port}`));
