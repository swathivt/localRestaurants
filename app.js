const express = require('express');
const path =  require('path');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app =  express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: true}));

// For CSS file to use in views
app.use(express.static('/views'));  
app.use(express.static(__dirname + "/views"));

app.use('/', routes);

module.exports = app;