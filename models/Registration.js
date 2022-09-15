const mongoose = require('mongoose');
//Each key in the registrationSchema code defines a property in the documents that will be added to the MongoDB database
const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  emailAddress: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  }
});



module.exports = mongoose.model('Registration', registrationSchema,'users');
console.log('collection created.')