const mongoose = require('mongoose');
const key = require('../nodejs/keys').MongoUri;

/*mongoose.connect(key, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err) =>{
    if(err) throw err;
});*/
console.log('Intents database has been connected....');


const botsSchema = new mongoose.Schema({
    botCategory:{type:String},
    projectId:{type:String},
    botName:{type:String},
    botPlatform:{type:String, default:"null"},
    botIntents:[String],
    isTrained:{type:Boolean, default:false},
    trainingStatus:{type:String, default:'untrained'},
    status:{type:String, default:'not active'},
    whatsAppNumber:{type:String, default:'none'},
    whatsAppTokenId:{type:String, default:'none'}
});

const Schema = new mongoose.Schema({
    company_id: {type:  String, unique:true},
    allBots:[botsSchema],
    allIntents: [String],
    price:String
});

const model = mongoose.model('botInfo', Schema);

module.exports = model;
