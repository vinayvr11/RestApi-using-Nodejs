const mongoose = require('mongoose');
const user = mongoose.Schema({
    company_id:String,
    botsName:String,
    botsCategory:String,
    botsPlatform:String,
    botsPID:String,
    packPrice:String,
    description:String,
    dateOfBuy:String,
    whatsAppNumber:String,
    status:String,
});

const model = mongoose.model('admin', user);

module.exports = model;