const express = require('express');
const path =  require('path');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const routes = require('./routes/index');

const app =  express();

// user session settings

const oneMinute = 1000 * 60 * 1;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneMinute },
    resave: false 
}));

app.set('view engine','pug');
app.set('views', path.join(__dirname, 'views'));


// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// cookie parser middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

// For CSS file to use in views/serving public files
app.use(express.static('/views'));  
app.use(express.static(__dirname + "/views"));

app.use('/', routes);

module.exports = app;