const mongoose = require('mongoose');
const passportLocalMongoose  = require('passport-local-mongoose');
const removeChatDb = require('../DB/chatDb');
const removeIntentDb = require('../DB/intents');



/*let schema = new mongoose.Schema({
    removedUserChats: removeChatDb,
    removedUserBotsData: removeIntentDb
});

const model = mongoose.model('removedUsers', Schema);
module.exports = model;*/
