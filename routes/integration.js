const express = require('express');
const router = express();
const botInfo = require('../DB/intents');
let admin = require('../DB/adminDB');
let chatData = require('../DB/chatDb');
let botCreds = require('../DB/userCredDb');
let userData = require('../DB/SignupDb');

exports.integrate = async (req, res, next) => {
    console.log('Your integration request', req.body.project_id, req.body.company_id, req.body.name);
    let bots = await botInfo.findOne({company_id: req.body.company_id});
    let chats = await chatData.findOne({company_id: req.body.company_id});
    let getBotProjectId = undefined;
    let length = bots.allBots.length;
    let i = 0;
    console.log('Your whatsapp number', req.body.number);
    if (req.body.platform === 'Whatsapp' && req.body.number === undefined) {
        return res.json({
            error: 'Please provide your Whatsapp number'
        });
    }
    if (req.body.name != null && req.body.platform !== undefined && req.body.category !== undefined) {
        console.log('Enter into state', req.body.name, req.body.platform, req.body.category);
        for (i = 0; i < length; i++) {
            if (bots.allBots[i].projectId === req.body.project_id && bots.allBots[i].status === 'not active') {
                let chatLength = chats.botChats.length;
                if (req.body.platform === 'Website') {
                    getBotProjectId = bots.allBots[i].projectId;
                    console.log('Bot project id',getBotProjectId);
                }
                for (let j = 0; j < chatLength; j++) {
                    if (bots.allBots[i].projectId === chats.botChats[j].projectId) {
                        chats.botChats[j].botCategory = req.body.category;
                        chats.botChats[j].botPlatfom = req.body.platform;
                        chats.botChats[j].botName = req.body.name;
                        chats.save()
                            .then(result => {
                                console.log('Chat data updated');
                            }).catch(err => {
                            console.log('error in updating chat data');
                        })
                    }
                }
                bots.allBots[i].status = 'active';
                bots.allBots[i].botName = req.body.name;
                bots.allBots[i].botPlatform = req.body.platform;
                bots.allBots[i].botCategory = req.body.category;
                if (req.body.platform === 'Whatsapp' && req.body.number !== undefined) {
                    let integrateData = {
                        company_id: req.body.company_id,
                        botsName: req.body.name,
                        botsCategory: req.body.category,
                        botsPlatform: req.body.platform,
                        botsPID: bots.allBots[i].projectId,
                        packPrice: bots.price,
                        description: 'null',
                        dateOfBuy: 'null',
                        whatsAppNumber: req.body.number,
                        status: 'integration'
                    };
                    let saveAdmin = new admin(integrateData);
                    await saveAdmin.save()
                        .then(success => {
                            console.log('Request has been sent to admin data');
                        }).catch(err => {
                        console.log('Error occurs in sending request to admin');
                    });
                }
                await bots.save().then(result => {
                    console.log('Integrate data is saved successfully');
                }).catch(err => {
                    console.log('Error in saving integration data');
                });
                break;
            }
        }

        let afterSaveBots = await botInfo.findOne({company_id: req.body.company_id});
        //console.log('afterSaveData',afterSaveBots);
        let len = afterSaveBots.allBots.length;
        let requestBot = undefined;
        for (let i=0;i<len;i++) {
            if (afterSaveBots.allBots[i].projectId == getBotProjectId) {
                requestBot = afterSaveBots.allBots[i];
                break;
            }
        }
        if (i === length) {
            return res.json({
                'message': 'you have trained all of your bots'
            });
        } else {
            if (getBotProjectId) {
                console.log('enter into bot project id', requestBot);
                return res.json({
                    'message': 'Your request have been sent to the admins',
                    'requestBot': requestBot
                });
            } else {
                console.log('enter into else condition');
                return res.json({
                    'message': 'Your request have been sent to the admins',
                    'requestBot': null
                });
            }
        }
    } else {
        return res.json({
            'message': 'Please fill all your information'
        })
    }


    // console.log(req.body.category);

    // res.redirect('/chatbots');
};


router.get('/data', async (req, res, next) => {

    let data = await botInfo.findOne({company_id: req.user.company_id});

    res.json({
        data: data,
    })

});


const mail = require('../nodejs/mail');
exports.train =  async (req, res, next) => {

    userData.findOne({company_id: req.body.company_id}, (err, user) => {
        if (!user) {
            res.json({
                'message': 'No user exist of this id'
            })
        } else {
            if (user.isBuy) {
                trainBuy(req, res, user.email);
            } else if (user.isDemo) {
                trainDemo(req, res, user.email);
            }
        }
    })


};


const demoBot = require('../DB/demoChatDB');
let trainDemo = (req, res, email) => {
    console.log('body', req.body.name, req.body.platform, req.body.category);
    demoBot.findOne({company_id: req.body.company_id}, (err, data) => {
        let bot = data.botChats[0];
        bot.botName = req.body.name;
        bot.botCategory = req.body.category;
        bot.botPlatform = req.body.platform;

        data.save()
            .then(result => {
                res.json({
                    'message': 'Your demo bot train request has been sent to admins'
                })
            })
            .catch(err => {
                res.json({
                    'message': 'Our servers is in maintenance today please try after some time'
                })
            })

        saveAdminData(req.body.company_id,
            req.body.name,
            req.body.category,
            req.body.platform,
            req.body.project_id,
            'Free',
            email);
    })
}

let trainBuy = async (req, res, email) => {
    let data = await botInfo.findOne({company_id: req.body.company_id});
    console.log('Enter into state', req.body.name, req.body.platform, req.body.category);
    let getBotProjectId = undefined;
    let length = data.allBots.length;
    let i =0;
    let checkTrain = 0;
    for (i = 0; i < length; i++) {
        if (data.allBots[i].status !== 'trained' && req.body.project_id === data.allBots[i].projectId) {
            getBotProjectId = data.allBots[i].projectId;

            if (data.allBots[i].botPlatform === req.body.platform && data.allBots[i].botCategory === req.body.category &&
                data.allBots[i].botName === req.body.name) {
                console.log('enter');
                let bot = data.allBots[i];
                saveAdminData(data.company_id,
                    bot.botName,
                    bot.botCategory,
                    bot.botPlatform,
                    bot.projectId,
                    data.price,
                    email);

                break;
            }
        } else {
            checkTrain++;
        }

    }
    console.log(checkTrain);
    if (!getBotProjectId) {
        return res.json({
            "message": 'You have already trained this bot'
        })
    } else if (i===length) {
        return res.json({
            "message": 'Please enter the data that you have enter in integration request'
        })
    } else {
        let afterSaveBots = await botInfo.findOne({company_id: req.body.company_id});
        //console.log('afterSaveData',afterSaveBots);
        let len = afterSaveBots.allBots.length;
        let requestBot = undefined;
        for (let i=0;i<len;i++) {
            if (afterSaveBots.allBots[i].projectId == getBotProjectId) {
                requestBot = afterSaveBots.allBots[i];
                break;
            }
        }
        return res.json({
            'message': 'Your training request has been sent to admins',
            'trainRequestBot': requestBot
        })
    }

}


let saveAdminData = (company_id, name, category, platform, project_id, price, userEmail) => {
    let adminData = {
        company_id: company_id,
        botsName: name,
        botsCategory: category,
        botsPlatform: platform,
        botsPID: project_id,
        packPrice: price,
        description: 'null',
        dateOfBuy: 'null',
        status: 'train'
    };
    let saveAdmin = new admin(adminData);
    saveAdmin.save()
        .then(success => {
            let message = 'BotName: ' + name + ' Platform: ' + platform + ' Category: ' +category +
                ' CompanyId: ' + company_id;
            let email = userEmail;
            mail.sendMail(email, 'Bot Train request', message);
            console.log('Request has been sent to admin data');

        }).catch(err => {
        console.log('Error occurs in sending request to admin', err);
    });
}



exports.deactivate = async (req, res) => {
    let query = {isAssigned: true};
    let newValues = {$set: {isAssigned: false}};
    botCreds.updateMany(query, newValues, (err, result) => {
        if (err) {
            console.log('There is error in updating all userCreds');
        } else {
            console.log('UserCreds are changed');
        }
    });
    let creds = await botCreds.find({});
    res.json({
        "message": "updated creds",
        "creds": creds
    })
}

const removedUserDb = require('../DB/removedUsers');
exports.deactivateUser = async (req, res, next) => {
    await userData.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            res.json({
                "message": "No user exist of this id"
            })
        } else {
            if (user.isBuy) {
                let projectId = user.project_id;
                projectId.forEach( creds => {
                    let query = {project_id: creds};
                    let update = {isAssigned: false};
                    botCreds.findOneAndUpdate(query, update, (err, result) => {
                        if (err) {
                            console.log('error', err);
                            res.json({
                                "message": "error in deactivating the project id's of deactivateUser"
                            })
                        }
                    })
                });

                while (user.project_id.length > 0) {
                    user.project_id.pop();
                }
                user.isBuy = false;

            }
        }
    });
}

removeUser = (user, req, res) => {
    user.save()
        .then(result => {
            console.log('data saved');
            res.json({
                "message": "User removed successfully"
            })
        })
        .catch(err => {
            console.log("error", err);
            res.json({
                "message": "There is some error in removing the user"
            })
        })
}


//module.exports = router;
