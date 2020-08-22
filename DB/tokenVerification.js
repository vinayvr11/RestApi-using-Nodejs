const mongoose = require('mongoose');
const passportLocalMongoose  = require('passport-local-mongoose');

const Schema = new mongoose.Schema({
    token: String,
    email: String,
    name: String,
    phone: String,
    password: String,
    expire_at: {type: Date},
    affiliateId: String,
    referralCode: String,
    shareUrl:String
});

let model  = mongoose.model('emailVerifies', Schema);

module.exports = model;
