const mongoose = require('mongoose');
const key = require('../nodejs/keys').MongoUri;

/*mongoose.connect(key, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err) =>{
    if(err) throw err;
});*/
console.log('ourBotChats database has been connected....');

let Schema = new mongoose.Schema({
   ques:String,
   ans:String,
   date:String,
   intent:String
});

let HeadSchema = new mongoose.Schema({
    client_id: String,
    dialogFlowSessionId:String,
    chats:[Schema]
});

const model = mongoose.model('ourbotchat', HeadSchema);

module.exports = model;