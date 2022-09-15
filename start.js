const  express = require('express');
const mongoose123 = require('mongoose');
mongoose123.connect("mongodb+srv://swathy:Hanuman01@crud1.slqruqm.mongodb.net/?retryWrites=true&w=majority",
{
  // userNewUrlParser: true,
   useUnifiedTopology: true
});

mongoose123.connection
.on('open', () => {
    console.log('Mongoose connection open');
})
.on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
});

require('./models/Registration');

const app = require('./app');
const server = app.listen(8080, () => {
    console.log(`Express is running on port ${server.address().port}`);
})
