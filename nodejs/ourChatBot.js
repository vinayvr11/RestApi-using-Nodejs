const bot = require('../nodejs/chatBot');
const ourBotDb = require('../DB/ourBotCreds');
const ourChatBotChats = require('../DB/ourChatBotChats');
const uuid = require('uuid');
const chatBot = require('dialogflow');
const userData = require('../DB/userCredDb');



exports.renderOurBot =  function (req, res, next) {
    res.render('chatbot');
}

exports.renderUserBot = function (req, res, next) {
   // chatbotClass.renderChatbot(req, res);
    console.log('CID', req.query.Cid, " ", "Pid", req.query.Pid);
    res.render('userBot', {company_id: req.query.Cid, project_id: req.query.Pid});
}

let socket = require('../socket').getIo();

socket.on('connect', io => {
    console.log('socket is connected');

    io.on('botConnect', data => {
        console.log(data.text);
        replyChats(data.text, data.cookie);
    })
})

async function replyChats(text, cookie) {
    console.log('reply function has been called');
    let find = {project_id: "test-adkunn"};
    let clientExist =  await ourChatBotChats.findOne({client_id: cookie});

    ourBotDb.findOne({project_id: "test-adkunn"}, (err, user) => {
        if (err) {
            console.log("There is some error in ourBotDb");
        }
        if (!user) {
            console.log('User not found');
        } else {
            console.log("User exist");


            let sessionId = null;
            let sessionClient = null;
            if(clientExist != null){
                sessionId = clientExist.dialogFlowSessionId;
                console.log('user exist in dialogFlow', sessionId, cookie);


            }else{
                sessionId = uuid.v4();
                console.log('User not exist in dialogFlow', sessionId, cookie);

            }
            bot.f2(user.project_id, text, user, sessionId).then((answerChat) => {
                socket.emit('answer', {answer: answerChat});
                ourChatBotChats.findOne({client_id: cookie}, function (err, doc) {

                    let chatDB = {
                        ques: text,
                        ans: answerChat.fulfillmentText,
                        date: new Date(),
                        intent: answerChat.intent.displayName
                    };

                    if (!doc) {

                        let HeadSchema = {
                            client_id: cookie,
                            dialogFlowSessionId:sessionId,
                            chats: chatDB
                        };


                        let chatsStore = new ourChatBotChats(HeadSchema);
                        chatsStore.save().then(result => {
                            console.log('New User Has been saved at ourWebBot');
                        }).catch(err => {
                            console.log('There is some error in saving ourWebBot chats');
                        })
                    } else {

                        doc.chats.push(chatDB);
                        doc.save().then(result => {
                            console.log('New User Has been saved at ourWebBot');
                        }).catch(err => {
                            console.log('There is some error in saving ourWebBot chats');
                        })
                    }

                });
                /*  res.json({
                      answer: answerChat.fulfillmentMessages,
                      intent: answerChat.intent,
                      response: answerChat.fulfillmentText
                  });*/
            });


        }

    });
}

//module.exports = {reply: replyChats};

