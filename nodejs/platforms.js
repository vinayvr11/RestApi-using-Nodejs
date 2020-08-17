const userData = require('../DB/SignupDb');
const fetch = require('node-fetch');
const chatBot = require('../nodejs/chatbotOps');
const botInfo = require('../DB/intents');
exports.botComm = (req, res, next) => {
    console.log(req.body.company_id, "PID", req.body.project_id);
    userData.findOne({company_id: req.body.company_id}, function (err, user) {
        if (!user) {
            console.log("User is not present");
        } else {
            if (user.isBuy) {
                chatBot.callBot(req, res, user);
            }
        }
    });
}




exports.whatsApp =  async (req, res) => {
    let messages = req.body.messages;
    let eu = req.query.eu;
    let instance = req.query.instance;
    let token = req.query.token;
    let str = "https://"+eu+"/"+instance+"/sendMessage?token="+token;
    console.log('mesages',str);

    let user = await userData.findOne({whatsAppTokenId:token});
    let whatsAppNumber = user.whatsAppNumber;
    let whatsAppTokenId = user.whatsAppTokenId;
    let company_id = user.company_id;
    console.log('token id', user.whatsAppTokenId);
    let botInfos = await botInfo.findOne({company_id:company_id});
    let length = botInfos.allBots.length;
    console.log('length', length);
    let projectId = null;
    for (let i=0;i<length;i++){
        console.log(botInfos.allBots[i].botPlatform);
        if(botInfos.allBots[i].botPlatform === "WhatsApp" ||
            botInfos.allBots[i].botPlatform === "Whatsapp"){
            console.log('botfind');
            projectId = botInfos.allBots[i].projectId;
        }
    }

    if (messages != undefined) {
        for (let i = 0; i < messages.length; i++) {
            let phone = messages[i].chatId;
            let no = phone.match(/[0-9]+/g);
            console.log('Your number', no[0]);

            if (!messages[i].fromMe) {
                fetch('https://botscuadapi.herokuapp.com/bot', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cookie: messages[i].chatId,
                        text: messages[i].body,
                        company_id:company_id,
                        project_id:projectId,
                        platform: 'whatsApp'
                    }),
                }).then(result => {
                    return result.json();
                }).then(data => {
                    console.log("your number",no[0], data.answer);
                    fetch(str, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "phone": no[0],
                            "body": data.answer
                        }),
                    })
                });
            }
        }
    }
    console.log('End without results');

    res.sendStatus(200);
}
