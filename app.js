const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Student = require('./models/StudentSchema'); 
const app = express(); // Initialize the app first
var cookieparser = require('cookie-parser');
app.use(cookieparser());
// Middleware Setup
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json()); // Parse application/json

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// LiveReload Setup
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
app.use(connectLivereload());

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// Import the user router and set up routes


// Connect to MongoDB
mongoose.connect('mongodb+srv://j_hamad83:afpc1967@franks.wmjjvee.mongodb.net/?retryWrites=true&w=majority&appName=Franks')
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Error connecting to the database:", err);
  });
  const userrouter = require('./routes/user');
  app.use(userrouter);
// Define routes
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
