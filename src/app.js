const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Connecting to Data Base
mongoose.connect('mongodb://localhost/prestamoBibl')
    .then(db => console.log('Data Base Connected'))
    .catch(err => console.log('ERROR IN CONNECTION DB::', err));

// Importing Routes
const indexRoutes = require('./routes/index.js');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));

// Routes
app.use('/', indexRoutes.router);

// Starting the Server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});