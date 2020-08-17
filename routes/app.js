var express = require('express');
var router = express();
var mongoose = require('mongoose');
//require('mongoose-type-email');
var passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');

const ourBotCreds = require('../DB/ourBotCreds');


//Database call-
const UserData = require('../DB/SignupDb');
const userCredData = require('../DB/userCredDb');
const chatData = require('../DB/chatDb');
const demoChat = require('../DB/demoChatDB');
const botInfo = require('../DB/intents');

const cook = require('cookie-parser');
const {ensureAuthenticated} = require('../nodejs/auth');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
//Paytm params call
const https = require('https');
const checksum_lib = require('../nodejs/checksum');
//const paytmParams = require('../nodejs/payment');

//Call chatbot
const bot = require('../nodejs/chatBot');

const chatbotClass = require('../nodejs/chatbotOps');


//Testing the chats data here
const getChatData = require('../nodejs/getChats');





router.get('/chats', function (req, res, next) {
    getChatData.chats(req, res);
});


const dateDemo = require('../nodejs/demoForm');
//demoForm
router.get('/demoForm', (req, res, next) => {

    if (req.user == undefined) {
        req.flash('message', 'You have to log-in first');
        res.redirect('/');
        console.log('Please log-in first');
    } else {
        if (req.user.isBuy) {
            req.flash('message', 'You have already buy our chatBot');
            res.redirect('/');
        } else {
            res.render('demo_form');
        }
    }
});

router.post('/data', function (req, res, next) {
    UserData.find({demo_start_date: {$exists: true}}, function (err, user) {

        res.json({
            user: user
        });
    });

});


router.post('/demoForm', function (req, res, next) {


    if (req.user.demo_start_date !== undefined) {
        req.flash('message', 'You have already buy our demo');
        console.log('You already have our demo');
        res.redirect('/');
    } else {
        dateDemo.demo(req, res);

        req.flash('message', 'You have successfully buy our demo');
        res.redirect('/');
    }
    console.log(req.user.demo_start_date);


});

//route for buying the chatbot
const ourchatbot = require('../nodejs/ourChatBot');




router.get('/buy', function (req, res, next) {
    if (req.user == undefined) {
        req.flash('message', 'Please log-in first');
        res.redirect('/');
    } else {
        if (req.user.isBuy) {
            req.flash('message', 'You have already buy our Bots if you have any query please contact to admins');
            res.redirect('/');
        } else {
            res.render('buy', {quantity: req.query.quantity, price: req.query.price});
        }
    }
});


router.post('/buyBotSubmit', ensureAuthenticated, function (req, res, next) {
    console.log('buyBotSubmit route called');
    chatbotClass.buyChatbot(req, res);
    res.redirect('/');
});


//route for inserting the jsonCred file in database-
router.get('/file', function (req, res, next) {

    res.render('credFile');
});

router.post('/file', function (req, res, next) {
    const data = new userCredData(req.body);
    data.save()
        .then(item => {
            res.send('Your user Cred data has been saved');
        }).catch(err => {
        res.status(400).send("Unable to save the data");
    });
});





router.post('/checkDemo', (req, res, next) => {

    UserData.findOne({company_id: req.body.company_id}, function (err, user) {
        if (user.isDemo || user.isBuy) {
            chatbotClass.isDemoOver(req, res).then((result) => {
                if (result.cond) {

                    console.log("Your demo is over");
                } else {
                    console.log("You demo is not over");
                }
            });
        }
    });


});



//Chatbot route ends



router.post('/signUp', function (req, res, next) {
    register(req, res);
});


//Log-out handle-
router.get('/logout', (req, res) => {
    req.logout();
    res.json({
        'message':'user log out'
    });
});


//forgot password-
router.get('/forgot-pass-form', (req, res) => {
    res.render('forgotpass');
});




router.get('/reset/:token', function (req, res) {

    UserData.findOne({resetPasswordToken: req.params.token}, function (err, user) {
        if (!user) {
           
            res.json({
                error:'user not exist'
            });
        }
        res.render('resetPassword', {token: req.params.token});
    });
});





const autoLogin = require('../nodejs/autoLogin');
router.get('/', function (req, res) {
    if(req.user == undefined){
        res.render('index', {message: req.flash('message'), loggedIn: false}); 
    }else{
        res.render('index', {message: req.flash('message'), loggedIn: true});
    } 
});


router.get('/profile/:token', ensureAuthenticated, function (req, res) {
    userData.findOne({company_id: req.params.token}, (err, user) => {
       if (!user) {
           res.json({
              error: 'user not exist'
           });
       } else {
           res.json({
               'message': 'Authentication success',
               'userData': user,
           });
       }
    });
    console.log('req.user hello bro');

});

//router.use('/dashboard', ensureAuthenticated, require('../routes/dashboardRoute.js'));





//router.use('/history', ensureAuthenticated, require('../routes/historyRoute.js'))





const sendProblem = require('../nodejs/sendProblems');


//route to update user profile-
const updateProfile = require("../nodejs/updateProfile");

router.post('/updateProfile', ensureAuthenticated, function (req, res, next) {
    if (req.body.email !== "") {
        console.log("email", req.body.email);

    } else {
        console.log("Not null");
    }
    if(req.body){
        updateProfile.updateProfile(req, res);
        res.json({
            'userData':req.user,
            'message':'You have successfully updated your information'
        });
       // res.redirect("/profile");
    }else{
        res.json({
            'error':'You have not change any information'
        });
    }

});






var request = require('request');// npm install request




router.get('/chatbots', ensureAuthenticated, async (req, res, next)=>{
    let info = await botInfo.findOne({company_id: req.body.company_id});
    res.json({
        'userData':req.user,
        'botInfo':info
    });
   // res.render('my_chatbot', {user_data: req.user, botInfo:info});
})


router.get('/testing', (req, res, next)=>{

    res.render('chatbot');
});


module.exports = router;
