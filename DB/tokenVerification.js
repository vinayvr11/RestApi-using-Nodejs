const mongoose = require('mongoose');
const passportLocalMongoose  = require('passport-local-mongoose');

const Schema = new mongoose.Schema({
    token: String,
    email: String,
    name: String,
    phone: String,
    password: String,
    expire_at: {type: Date, default: Date.now, expires: 600000},
    affiliateId: String,
    referralCode: String,
    shareUrl:String
});

let model  = mongoose.model('emailVerifies', Schema);

module.exports = model;
