const router = require('express').Router();
var mongoose = require('mongoose');
var ClientChatDb = require('../DB/chatDb');
const {ensureAuthenticated} = require('../nodejs/auth');
const hash = require('hashmap');
const userData = require('../DB/SignupDb');

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];  // to map




// to make console.log the python way
function print(toPrint) {
   // console.log(toPrint);
}


// calculates past n day'th date and returns it
function calcPastDate(past_days) {
    var today = new Date();
    return (new Date(today.getTime() - (past_days * 24 * 60 * 60 * 1000)));
}


function msgsFreq(pastDaysElement, day) {
    var msgCounter = 0;
    var sessionCounter = 0;
    pastDaysElement.forEach(element => {
        if (new Date(element.date).getDate() == day) {
            // print(element.chats.length)
            msgCounter = msgCounter + (element.chats.length);
            sessionCounter = sessionCounter + 1;

        }
    });
    return [msgCounter, sessionCounter];
}

function getAllBots(doc) {

    var botNamesList = []
    try {
        doc.botChats.forEach(botElement => {
            botNamesList.push(botElement.projectId)
        });
    } catch (err) {
        console.log("error getting all bots of client:", err)
    }
    return botNamesList
}


// route to show Dashboard
exports.dashboard = async function (req, res) {
    const map = new hash();
    console.log('Your bot id ', req.params.requested_bot);
    let data = await userData.findOne({company_id: req.body.company_id});
    if (!data) {
        res.json({
            'error': 'user not found'
        })
    } else {
        if (data.isDemo) {
            console.log('inside the demo user');
            demoUser(req, res);
        } else if (data.isBuy) {
            console.log('inside the buy user');

            buyUser(req, res);
        }
    }
    // past 10 days labels and frequency

};

const demoChatDb = require('../DB/demoChatDB');

function demoUser(req, res) {
    demoChatDb.findOne({company_id: req.body.company_id}, (err, data) => {
        if (err) {
            console.log('There is some error in demoChatDb at dashboard', err);
            res.status(404).json({
                'message': 'There is some error from server side'
            })
        } else if (!data) {
            res.json({
                'message': 'No user found of this Id'
            })
        } else if (data) {
            let element = data.botChats[0];
            let allBots = element.projectId;
            if (element.sessionChats.length === 0) {
                res.json({
                    'userData': {
                        'name': data.name,
                        'lineChartLabels': [],
                        'msgChartData': [],
                        'sessionChartData': [],
                        botNames: allBots
                    }
                });
            }else {
                dashboardData(res, allBots, element, data);
            }

        }

    })
}



function buyUser(req, res) {
    ClientChatDb.findOne({company_id: req.body.company_id}, function (err, data) {

        if (!data) {
            return res.json({
                error: 'user not exist'
            })
        } else {
            var allBots = getAllBots(data);


            if (req.params.requested_bot == undefined) {
                if (!req.params.requested_bot) {
                    res.json({
                        'userData': {
                            'name': data.name,
                            'lineChartLabels': [],
                            'msgChartData': [],
                            'sessionChartData': [],
                            botNames: allBots
                        }
                    });
                    // res.render('dash', {user_data: {name: req.user.name, lineChartLabels: [], msgChartData: [],
                    //                                sessionChartData: [], botNames: allBots}})
                }
            } else if (req.params.requested_bot) {
                if (!allBots.includes(req.params.requested_bot)) {
                    return res.json({
                        'message': 'bots not found'
                    })
                } else {
                    let docChatLength = data.botChats.length;
                    //let req_bot = allBots[0];
                    let req_bot = req.params.requested_bot;
                    data.botChats.forEach(element => {
                        if (element.projectId == req_bot) {
                            if (element.sessionChats.length === 0) {
                                res.json({
                                    'userData': {
                                        'name': data.name,
                                        'lineChartLabels': [],
                                        'msgChartData': [],
                                        'sessionChartData': [],
                                        botNames: allBots
                                    }
                                });
                            } else {
                                dashboardData(res, allBots, element, data);
                            }
                        }
                    })
                }
            }
        }
    });
}


function dashboardData(res, allBots, element, data) {
    let length = element.sessionChats.length;
    var total_sessions = [];
    var msgsfreqData = [];
    var sessionfreqData = [];
    var Labels = [];
    var freq;
    let dictIntent = {};
    let intent = [];
    let pastDaysElement = [];
    if (length > 0) {


        var mainBotElement = element;

        // Get Past 10 days all data, so that we do not need to loop on whole data again and again.
        mainBotElement.sessionChats.forEach(element => {
            //console.log('elements- ', element);
            var stored_date = new Date(element.date);
            var today = new Date();

            if (stored_date <= today && stored_date >= calcPastDate(10)) {

                pastDaysElement.push(element);
            }
        });
        let intents = [];
        let sessionChat = {};

        let chats = mainBotElement.sessionChats;



        

        for (let i = 0; i < length; i++) {
            let len = chats[i].chats.length;
            let sessChats = chats[i].chats;
            for (let j = 0; j < len; j++) {


                if (!sessionChat[sessChats[j].intents]) {
                    sessionChat[sessChats[j].intents] = 1;
                } else {
                    let total = sessionChat[sessChats[j].intents];
                    total++;
                    sessionChat[sessChats[j].intents] = total;
                }

                //intents.push(sessChats[j].intents);
            }
        }
        for (let key in sessionChat) {
            let str = key.toString();
            intents.push({
                name: key,
                value: sessionChat[key]
            })
        }
        let intentsSorted = [];
        var sorted = intents.sort(function (a, b) {
            return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
        });
        let sort = [];
       // let dictIntent = {};
        let mainSortLength = sorted.length;
        let sortLength = Math.abs(mainSortLength - 5);
        console.log("your chats", sorted[0].name.split(' ')[0], sorted[0].value);
        for (let i = mainSortLength - 1; i >= sortLength; i--) {
            dictIntent[sorted[i].name.split(' ')[0]] = sorted[i].value;
        }
        //console.log('Your intents',intents);
        //intents.push({'buy': '10'});
        //intents.push({'demo': '25'});


        var sorted = intents.sort(function (a, b) {
            return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
        });

        let mainSortLengths = sorted.length;
        let sortLengths = Math.abs(mainSortLengths - 5);
        // console.log("your chats", sorted[0].name, sorted[0].value);

        for (let i = mainSortLengths - 1; i >= sortLengths; i--) {
            dictIntent[sorted[i].name.split(' ')[0]] = sorted[i].value;
        }

        console.log('Your intents', intents);

        for (var days = 9; days >= 0; days--) {
            var last = calcPastDate(days);
            var date = last.getDate();
            var month = last.getMonth();
            freq = msgsFreq(pastDaysElement, date);

            msgsfreqData.push(freq[0]);
            sessionfreqData.push(freq[1]);
            Labels.push(date + '-' + months[month])

        }

        for (const [key, value] of Object.entries(dictIntent)) {
            let d = {};
            d[key] = value;
            intent.push(d);
        }

        console.log('Your dashboard charts data', sessionfreqData);

        res.json({
            'userData': {
                'name': data.botName,
                'lineChartLabels': Labels,
                'msgChartData': msgsfreqData,
                'sessionChartData': sessionfreqData,
                'botNames': allBots,
                'user': data,
                'intents': intents
            }
        });
    }
}

