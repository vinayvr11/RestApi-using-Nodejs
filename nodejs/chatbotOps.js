const chatData = require('../DB/chatDb');
const crypto = require('crypto');
const UserData = require('../DB/SignupDb');
const bot = require('../nodejs/chatBot');
const userCredData = require('../DB/userCredDb');
const UserCredObj = require('../nodejs/allObjects');
const intent = require('../DB/intents');
const rand = require('random-key');
const demoChatDB = require('../DB/demoChatDB');
const mail = require('../nodejs/mail');
const uuid = require('uuid');


async function isAssignedBots(doc) {
    await doc.forEach(function (data) {
        data.isAssigned = true;
        data.save();
    });
}


function DBObjAssigned(name, category, projectID, platform) {
    let chatsObj = {
        botCategory: category,
        projectId: projectID,
        botName: name,
        botsPlatform: platform
    };

    return chatsObj;
}


let socket = require('../socket').getIo();

socket.on('connect', io => {
    console.log('socket is connected');
    io.on('welcome', async data => {
        console.log('welcome socket called', data.company_id, data.project_id);
        UserData.findOne({company_id: data.company_id}, (err, user) => {
            console.log('Demo user chats', user);
            if (user.isDemo) {
                welcomeStartDemo(data, demoChatDB);
            } else if (user.isBuy) {
                welcomeStartBuy(data, chatData);
            }
        });

    })
    io.on('userBotConnect', data => {
        console.log(data.text,);
        chatbotResponse(data.text, data.cookie, data.company_id, data.project_id, data.platform);
    })
})
const demoBotChat = require('../DB/demoChatDB');
welcomeStartDemo = (data) => {
    demoBotChat.findOne({company_id: data.company_id}, async (err, data) => {
        let bot = data.botChats[0];
        if (bot.welcomeMessages) {
            await socket.emit('welcomeMessage', {answer: bot.welcomeMessages, type: 'demo'});
        }
    })
}

welcomeStartBuy = (data, database) => {
    console.log("Your company_id- ", data.company_id);

    database.findOne({company_id: data.company_id}, async (err, user) => {
        let length = user.botChats.length;
        for (let i = 0; i < length; i++) {
            if (user.botChats[i].projectId === data.project_id) {
                console.log('welcome messages ', user.botChats[i].welcomeMessages);

                await socket.emit('welcomeMessage', {answer: user.botChats[i].welcomeMessages, type: 'welcome'});
            }
        }
    });
}

exports.callBot = (req, res) => {
    chatbotResponse(req.body.text, req.body.cookie, req.body.company_id, req.body.project_id, req.body.platform, res);
}

async function chatbotResponse(text, cookie, company_id, project_id, platform, res) {
    //console.log('ChatbotOps reply to', user.isDemo);
    console.log('PID', project_id);
    console.log('company_id', company_id);
    console.log('cookie', cookie);
    console.log('text', text);


    await UserData.findOne({company_id: company_id}, (err, user) => {
        if (!user) {
            console.log('user not found');
        } else {
            if (user.isDemo) {
                console.log('enter into user demo');

                let date = new Date();
                if (user.demo_end_date >= date) {

                    demoBotReply(company_id, project_id, text, cookie);

                } else {
                    console.log('enter into user buy');
                    user.isDemo = false;
                    socket.emit('userAnswer', {answer: undefined, type: "demo"});
                    user.save()
                        .then(result => {
                            console.log('demo expired');
                        })
                        .catch(err => {
                            console.log('error in demo reply');
                        })
                }
            }
            if (user.isBuy) {
                console.log('enter into user buy');


                buyBotReply(company_id, project_id, text, cookie, platform, res);
            }
        }
    })
}

getUserCreds = async (project_id) => {
    let credential = undefined;
    credential = await userCredData.findOne({project_id: project_id}).exec();
    return credential;
}

getAnswerChat = async (project_id, text, dict, sessionId) => {
    let answer = await bot.f2(project_id, text, dict, sessionId);
    return answer;
}


function demoBotReply(company_id, project_id, text, cookie) {
    demoChatDB.findOne({company_id: company_id}, (err, user) => {
        if (!user) {
            console.log('user not exist');
        } else {
            let creds = getUserCreds(project_id);
            console.log('your creds', creds);
            let sessionId = uuid.v4();
            creds.then(data => {
                console.log('Promise return', data);
                let answerChat = getAnswerChat(project_id, text, data, cookie);
                console.log('Your answerChats', answerChat);
                answerChat.then(answer => {
                    socket.emit('userAnswer', {answer: answer});
                    console.log('User answer', answer.fulfillmentText);
                    let bots = user.botChats[0];
                    let chats = {
                        ques: text,
                        ans: answer.fulfillmentText,
                        intents: answer.intent.displayName
                    }

                    let sessions = {
                        session_id: cookie,
                        chats: chats,
                        date: Date()
                    }

                    let sessionsLength = bots.sessionChats.length;
                    let sessionsChats = bots.sessionChats;
                    let i = 0;
                    for (i = 0; i < sessionsLength; i++) {
                        if (sessionsChats[i].session_id === cookie) {
                            sessionsChats[i].chats.push(chats);
                            break;
                        }
                    }

                    if (i === sessionsLength) {
                        sessionsChats.push(sessions);
                    }

                    user.save()
                        .then(result => {
                            console.log('Your demoBot chats are saving................');
                        })
                        .catch(err => {
                            console.log('error in saving your demoBot chats????????', err);
                        })
                })
            })
        }
    })
}


function buyBotReply(company_id, project_id, text, cookie, platform, res) {

    let creds = getUserCreds(project_id);
    console.log('your creds', creds);
    chatData.findOne({company_id: company_id}, (err, user) => {
        if (!user) {
            console.log('User not exist or not buy the chatBots -> chatDataBase');
        } else {
            creds.then(data => {
                let answerChat = getAnswerChat(project_id, text, data, cookie);
                answerChat.then(answer => {
                    if (platform === 'website') {
                        socket.emit('userAnswer', {answer: answer});
                    }
                    let chatObj = new chatData();

                    let chats = {
                        ques: text,
                        ans: answer.fulfillmentText,
                        intents: answer.intent.displayName
                    };
                    let sessions = {
                        session_id: cookie,
                        chats: chats,
                        date: Date()
                    };

                    let botLength = user.botChats.length;

                    for (let i = 0; i < botLength; i++) {
                        if (user.botChats[i].projectId === project_id) {
                            let chatLength = user.botChats[i].sessionChats.length;
                            let j = 0;
                            for (j = 0; j < chatLength; j++) {
                                if (user.botChats[i].sessionChats[j].session_id === cookie) {
                                    user.botChats[i].sessionChats[j].chats.push(chats);
                                    break;
                                }
                            }

                            if (j === chatLength) {
                                user.botChats[i].sessionChats.push(sessions);
                            }

                        }
                    }

                    user.save()
                        .then(result => {
                            console.log('Buy bots chats are saving.........');
                        })
                        .catch(err => {
                            console.log('There is some error in saving buy chatBot data......');
                        })

                    if (platform === 'whatsApp') {
                        res.json({
                            answer: answer.fulfillmentText
                        })
                    }

                })
            })
        }
    })

}


exports.buyChatBot = (req, res) => {
    //Assigning the bot to the user after payment
    console.log(req.app.get('price'), req.app.get('quantity'), req.body.payload.payment.entity.email);

    let price = req.body.payload.payment.entity.amount;
    let company_id = req.body.payload.subscription.entity.notes.customer_id;
    let quantity = req.body.payload.subscription.entity.notes.quantity;

    console.log("checking companyID", quantity);

    let botsSchema = {
        name: 'none',
        category: 'none',
        projectID: 'none'
    };
    if (quantity) {


        UserData.findOne({company_id: company_id}, function (err, user) {
            console.log("User buying chatbot", quantity);
            if (user.isBuy) {
                res.json({
                    'error': 'You have already buy our bots'
                });
            } else {

                let totalQuantity = parseInt(quantity);

                let email = user.email;
                if (user.isDemo && totalQuantity == 1) {
                    //Save user data here if the user have demo and the user select only one chatbot
                    user.project_id.push(user.demoPId);
                    let genID = rand.generate();
                    let chatArr = [];
                    let DB = DBObjAssigned('none', 'none', user.demoPId);

                    chatArr.push(DB);
                    let chatsHead = {
                        company_id: user.company_id,
                        botChats: chatArr
                    };

                    let intentArr = [];
                    intentArr.push(DB);

                    let intentHeadDB = {
                        company_id: user.company_id,
                        allBots: intentArr,
                        price: price,
                    };

                    let intents = new intent(intentHeadDB);
                    let chats = new chatData(chatsHead);
                    user.isDemo = false;
                    user.isBuy = true;
                    intents.save().then(result => {
                        console.log("Success");
                    }).catch(err => {
                        console.log('Error occurs', err);
                    });
                    chats.save().then(result => {
                        console.log('Successs');
                    }).catch(err => {
                        console.log("Error occured", err);
                    });
                    user.save();

                } else {
                    //Getting the category list from the user select categories-
                    //creating all the above objects for botinfo

                    let botInfo = [];
                    let chatsInfo = [];

                    if (user.isDemo) {
                        totalQuantity -= 1;

                        user.project_id.push(user.demoPId);


                        let DB = DBObjAssigned('none', 'none', user.demoPId);

                        botInfo.push(DB);
                        chatsInfo.push(DB);

                    }

                    userCredData.find({isAssigned: false}).limit(totalQuantity).exec(function (err, doc) {
                        // console.log('project_ID', doc);
                        user.isBuy = true;
                        user.isDemo = false;

                        if (err) throw err;
                        if (doc === null) {
                            console.log('Data is not found');
                        } else {

                            for (let i = 0; i < totalQuantity; i++) {
                                let name = 'bot' + (i + 1);
                                console.log('Checking the loop conditions', doc[i].project_id);
                                user.project_id.push(doc[i].project_id);
                                let DB = DBObjAssigned(name, 'none', doc[i].project_id, 'none');
                                botInfo.push(DB);
                                chatsInfo.push(DB);
                            }

                            let botHeadSchema = {
                                company_id: user.company_id,
                                botChats: chatsInfo
                            };
                            let intentHeadSchema = {
                                company_id: user.company_id,
                                allBots: botInfo,
                                price: price
                            };

                            isAssignedBots(doc);

                            user.save().then(result => {
                                console.log('Your data saved to signup');
                            }).catch(err => {
                                console.log('Error in signup db', err);
                            });
                            //console.log('Your data ', botinfo);

                            //Both for loops ends here
                            //saving all the botinfo data to botinfo database
                            intent.findOne({company_id: user.company_id}, (err, intentUser) => {

                                //botInfo bots Schema

                                if (!intentUser) {
                                    let intents = new intent(intentHeadSchema);
                                    intents.save().then(result => {
                                        console.log('Your botinfo is saved');
                                    }).catch(err => {
                                        console.log('There is some error in saving botinfo', err);

                                    })
                                }
                            });


                            //Saving all the chatdata to chatdata database
                            chatData.findOne({company_id: user.company_id}, (err, user) => {
                                if (user) {
                                    console.log("This data is already stored");
                                } else {

                                    //   //saving chats data here
                                    let chats = new chatData(botHeadSchema);
                                    //  //saving botInfo here
                                    chats.save().then(result => {
                                        console.log('Client id is saved to chats data');
                                        mail.sendMail(email, 'Successfully Buy ChatBot', 'You have buy our chatbot of - ' + price);
                                    }).catch(err => {
                                        console.log('There is some error in saving client id to chats data');
                                        console.log(err);
                                    })
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}


//module.exports = ChatbotOps;
