const mongoose = require('mongoose');

const sessions = new mongoose.Schema({
    ques: String,
    ans: String,
    intents:String,
});


const clientIntents = new mongoose.Schema({
    session_id:String,
    ///dialogFlowSessionId:String,
    chats:[sessions],
    date:String,
});

const botInfo = new mongoose.Schema({
    botCategory:{type:String},
    welcomeMessages:Object,
    botPlatform:{type:String},
    projectId:{type:String},
    whatsAppNumber:{type:String, default:'none'},
    whatsAppTokenId:{type:String, default: 'none'},
    botName:{type:String},
    sessionChats:[clientIntents],
});

const Schema = new mongoose.Schema({
    company_id: {type:  String, unique:true},
    botChats:[botInfo],
});

const model = mongoose.model('Chatdatas', Schema);

module.exports = model;
