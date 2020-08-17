const mongoose = require('mongoose');

const schema = mongoose.Schema({
   planId: {type: String},
   amount: {type: String},
   planName: {type: String},
   billingFrequency: {type: String},
   quantity: {type:String}
});

const model = mongoose.model('botPlans', schema);

module.exports = model;
