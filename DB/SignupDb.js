const mongoose = require('mongoose');
const passportLocalMongoose  = require('passport-local-mongoose');



//Creating Schema-

const Schema = new mongoose.Schema({
    company_id:{type:String, unique:true},
    username: {type: String},
    name: {type: String},
    last: {type: String},
    email: {type:String},
    companyName:{type:String},
    companyUrl: {type:String},
    companyAddress: {type:String},
    phone: {type: Number},
    password:{type: String},
    resetPasswordToken:{type: String},
    project_id: [String],
    demo_start_date: Date,
    demo_end_date: Date,
    bot_buy_date:Date,
    demoPId:String,
    isDemo: {type: Boolean, default: false},
    isBuy: {type: Boolean, default: false},
    whatsAppTokenId:{type:String, default: 'none'},
    whatsAppNumber:{type:String, default:'none'},
    company_name: {type: String},
    company_url: {type:String},
    address: {type: String},
    active:{type: Boolean, default: false},
    GENERATED_VERIFYING_URL: String
});


Schema.plugin(passportLocalMongoose);


//Creating the database model-
var model  = mongoose.model('UserData', Schema);



module.exports = model;
