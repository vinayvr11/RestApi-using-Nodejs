const express = require('express');
const router = express();
const admin = require('../nodejs/adminOps');
const adminDb = require('../DB/adminDB');
const userData = require('../DB/SignupDb');
const botsInfo = require('../DB/intents');
const botChats = require('../DB/chatDb');
router.get('/botSupport', function (req, res, next) {
    res.render('botSupportPage', {user_data: req.user});
});


const botOps = require('../nodejs/botSupportAllOps');

exports.botsTrainedInfo = async function (req, res, next) {

    await userData.findOne({company_id: req.params.token}, (err, user) => {
       if (!user) {
           res.json({
               error: 'user not found'
           })
       } else {
           if (user.isBuy || user.isDemo) {
               //let n =  botOps.botOps.getNoOfBots(req, res);
              // console.log('total bots', n.totalBots + " " + n.botsTrained);
              // res.json({
               //    totalBots: n.totalBots,
                 //  botTrained: n.botsTrained
              // });
           }
       }
    });

}




/*router.post('/postAdmin', (req, res, next) => {
    admin.saveAllWork(req, res);
    res.redirect('/botSupport');
});*/


router.get('/adminfuncs', function (req, res, next) {
    console.log('Admin page is called');

    admin.getTotalUsers().then((result => {
        console.log('Total Users', result);
    }));

    admin.getTotalBots().then((result => {
        console.log('Total Bots', result);
    }));

    admin.getTotalAssignedBots().then((result => {
        console.log('Total Assigned Bots', result);
    }));

    admin.getUnAssignedBots().then((result => {
        console.log('Total UnAssigned Bots', result);
    }));

    admin.getAllDemoUsers().then(result => {
        console.log('Demo Users', result);
    });

    admin.getAllBotSubscriptionUsers().then(result => {
        console.log('Subscription Users', result);
    })

});


router.get('/admin', (req, res, next) => {
    res.render('admin');
});

router.get('/adminData', async (req, res, next) => {
    var data = await adminDb.find({});
     console.log('your data', data);
    res.json({
        data: data
    })
});


router.post('/adminData', async (req, res, next) => {

    var data = await adminDb.findOne({company_id: req.body.company_id});
    console.log('fetchData', data);
    res.json({
        data: data
    });
});



router.post('/updateBotsInfo', (req, res, next) => {
     console.log('companyIf', req.body.welcomeMessages);

    userData.findOne({company_id:req.body.company_id}, (err, user)=>{
        if(!user){
            console.log('user not exist in resister database');
        }else{
            user.whatsAppNumber = '91'+req.body.whatsAppNumber;
            user.whatsAppTokenId = req.body.whatsAppTokenId;
            user.save()
                .then(result=>{
                    console.log('Your whatsApp number is save');
                })
        }
    });

    botChats.findOne({company_id:req.body.company_id}, (err, user)=>{
       if(!user){
           console.log('Wrong company_id in chatData');
       }else{


           let length = user.botChats.length;
           for (let i = 0; i < length; i++) {
               if (user.botChats[i].projectId === req.body.botId) {
                   if(req.body.welcomeMessages){
                       let welcomeMessages = req.body.welcomeMessages.split('$');
                       for(let j=0;j<welcomeMessages.length;j++){
                           user.botChats[i].welcomeMessages.push(welcomeMessages[j]);
                           console.log(welcomeMessages[j]);
                       }
                   }
                   user.botChats[i].whatsAppNumber = req.body.whatsAppNumber;
                   user.botChats[i].whatsAppTokenId = req.body.whatsAppTokenId;
                   user.save().then(result=>{
                       console.log('Your chat data is saved');
                   });

                   break;
               }
           }
       }
    });

    botsInfo.findOne({company_id: req.body.company_id}, (err, user) => {
        if (!user) {
            console.log('Wrong company_id');
        } else {
            let length = user.allBots.length;
            for (let i = 0; i < length; i++) {
                if (user.allBots[i].projectId === req.body.botId && req.body.check ) {
                    if(req.body.check === 'train') {
                        user.allBots[i].isTrained = true;
                        user.allBots[i].status = 'trained';
                    }else {
                        user.allBots[i].whatsAppNumber = req.body.whatsAppNumber;
                        user.allBots[i].whatsAppTokenId = req.body.whatsAppTokenId;
                        user.allBots[i].trainingStatus = 'integrated';
                    }
                    user.save().then(result=>{
                       console.log('Your data is saved');
                    });

                    break;
                }
            }
        }
    });
    res.redirect('/design');
});

const demoBotData = require('../DB/demoChatDB');

router.post('/welcomeMessage', (req, res, next)=>{
    console.log('company_id', req.body.company_id);
    userData.findOne({company_id: req.body.company_id}, (err, user) => {
        if (!user) {
            console.log('Please give right creds');
        } else {
            if (user.isDemo) {
                welcomeMessageDemo(req, res);
            } else if (user.isBuy) {
                welcomeMessageBuy(req, res);
            }
        }
    })
});



exports.myBot = function (req, res, next) {

    botsInfo.findOne({company_id: req.body.company_id}, (err, user) => {
        if (!user) {
            res.json(
                {
                    'message': 'user not found'
                }
            );
        } else {
            res.json(
                {
                    'message': 'user found',
                    'botsData': user
                }
            );
        }
    });

}


//module.exports = router;
