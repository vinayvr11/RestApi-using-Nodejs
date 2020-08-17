const mongoose = require('mongoose');


const clients = mongoose.Schema({
    company_id: String,
    name: String,
    email: String,
    phone: String,
    shareUrl: String,
    planPrice: String,
    planType: String,
    dataOfBuy: String,
});


const schema = mongoose.Schema({
    userName:String,
    affiliateId: String,
    name: String,
    referralCode: String,
    phone: String,
    email: String,
    shareUrl: String,
    password: String,
    resetPasswordToken: String,
    affiliateClients: [clients]
})


const model = mongoose.model('affiliateUsers', schema);

module.exports = model;
