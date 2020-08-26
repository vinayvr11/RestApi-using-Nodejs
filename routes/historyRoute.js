const router = require('express').Router();
var mongoose = require('mongoose');
var ClientChatDb = require('../DB/chatDb');
let userData = require('../DB/SignupDb');
let demoChatDb = require('../DB/demoChatDB');

const {ensureAuthenticated} = require('../nodejs/auth');


function print(toPrint) {
    console.log(toPrint);
}


// route to show history
exports.his = async function (req, res) {
    console.log("Your company id ", req.body.company_id);
    var total_sessions = [];

    console.log('Called route', req.params.requested_bot);

    userData.findOne({company_id: req.body.company_id}, (err, data) => {
        if (!data) {
            res.json({
                'error':'user not found'
            })
        } else {
            if (data.isBuy) {
                historyBuyUser(req, res);
            } else if (data.isDemo) {
                historyDemoUser(req, res);
            }
        }
    });
};


historyDemoUser = (req, res) => {
    demoChatDb.findOne({company_id: req.body.company_id}, function (err, data) {
        //console.log('data', data.botChats[1].sessionChats);
        if (!data) {
            res.json({
                'message': 'user not exist'
            })
        } else {
            let botNames = [];
            botNames.push(data.botChats[0].projectId);
            let element = data.botChats[0];
                console.log('lop');
                    console.log('bots matched');
                    res.json({
                        "userData":{
                            "data": element.sessionChats,
                            "botNames": botNames
                        }
                    })
        }
    })
}

historyBuyUser = (req, res) => {
    
    ClientChatDb.findOne({company_id: req.body.company_id}, function (err, data) {
        //console.log('data', data.botChats[1].sessionChats);
        if (!data) {
            res.json({
                'message': 'user not exist'
            })
        } else {
            let botNames = [];

            data.botChats.forEach(element => {
                botNames.push(element.projectId);
            })
            data.botChats.forEach( element => {

                console.log('lop', element.projectId);
                if (element.projectId === req.params.requested_bot) {
                    console.log('bots matched');
                    res.json({
                        "userData":{
                            "data": element.sessionChats,
                            "botNames": botNames
                        }
                    })
                }
            })

        }
    })
}
