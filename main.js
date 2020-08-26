var express = require('express');
var cookieParser = require('cookie-parser');
const flash = require('req-flash');
var app = express();
app.use((req, res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})
const mongoose = require('mongoose');
const nev = require('email-verification')(mongoose);
const session = require('express-session');
const mongoDbConnection = require('connect-mongodb-session')(session);
const passport = require('passport');
const key = require('./nodejs/keys').MongoUri;

const admin = require('./routes/admin');
const integration = require('./routes/integration');
const cors = require('cors');
//const paymentRoute = require('./routes/paymentroute');
//require('./nodejs/passport-fun')(passport);
const bcrypt = require('bcryptjs');
const store = new mongoDbConnection({
    uri: 'mongodb+srv://vinay:vr54640@cluster0-pkeoz.mongodb.net/test?retryWrites=true&w=majority',
    collection: 'sessions'
});

const ourBotCreds = require('./DB/ourBotCreds');


//Database call-
const UserData = require('./DB/SignupDb');
const userCredData = require('./DB/userCredDb');
const chatData = require('./DB/chatDb');
const demoChat = require('./DB/demoChatDB');
const botInfo = require('./DB/intents');

const {ensureAuthenticated, emailVerify} = require('./nodejs/auth');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
//Paytm params call
const https = require('https');
const checksum_lib = require('./nodejs/checksum');
const register = require('./nodejs/register');
const passwordAuthOps = require('./nodejs/passwordAuthOps');


//Call chatbot
const bot = require('./nodejs/chatBot');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {authenticate} = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('express-validator');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));


//app.use(compress); //This line will compress all the static file before sending to the server

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
//app.use(passport.initialize());
//app.use(passport.session());


app.get('/', (req, res) => res.redirect('/api-docs'))
mongoose.connect(key, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Your are connected to mongoose database');
});

mongoose.set("useCreateIndex", true);
app.use(flash());
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//app.use(admin);
//app.use(paymentRoute);
//app.use(integration);
const httpServer = app.listen(app.get('port'), function () {
    console.log('Server has started at ', app.get('port'));
});

const socket = require('./socket').init(httpServer);
const chatbotClass = require('./nodejs/chatbotOps');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Significant bots api docs",
            description: "Automatic authentication api's, no need of token",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["https://botscuadapi.herokuapp.com/"]
        }
    },
    apis: ["main.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//routes
/**
 * @swagger
 * /test:
 *  get:
 *    summary: check either server is working or not
 *    description: Just to test api's are working or not, just execute directly no parameters required
 *    responses:
 *      '200':
 *          description: success
 */
app.get("/test", (req, res) => {
    res.send("Working!")
});





app.get('/failure', (req, res, nxt) => {
    res.json({
        'error': 'Wrong credentials'
    });
});


/**
 * @swagger
 *
 * /login:
 *   post:
 *     summary: Login to our website
 *     description: need to provide email and password, sample email is already filled, execute directly to test
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         value: 'akash021tyagi@cool.com'
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         value: 'Ty@g1boys'
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
const User = require('./DB/SignupDb');
const affiliate = require('./DB/affiliateRegisterDb');

app.post('/login', validator.check('email').isEmail(), (req, res, next) => {
    const error = validator.validationResult(req);
    if (!error.isEmpty()) {
        console.log('email is not correct');
        res.json({
            error: 'Email is not valid'
        });
    } else {


        User.findOne({email: req.body.email}, function (err, user) {
            if (!user) {
                console.log("User not registered");
                res.json({
                    error: 'User not registered'
                })
            } else {
                
                //Match Password

                console.log(req.body.password);
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    console.log(isMatch);
                    if (isMatch) {
                        console.log('Password matched');
                        const token = jwt.sign({email: user.email, userId: user._id}, 'secret');
                        res.status(200).json({
                            'message': 'success login',
                             "token": token,
                            'userData': user,
                            "type": "client"
                        })
                    } else {
                        console.log("Password doesn't matched");
                        res.json({
                            error: 'Wrong password'
                        })
                    }
                });
        }
        });
    }
});


/**
 * @swagger
 *
 * /signup:
 *   post:
 *     summary: register to our website
 *     description: for sign up you need to fill form values, it converts that form into json and then post when we execute it, Atleast replace email id to proceed successfully
 *     parameters:
 *       - name: UserName
 *         in: formData
 *         required: true
 *         type: string
 *         value: test123
 *
 *       - name: name
 *         in: formData
 *         required: true
 *         type: string
 *         value: Aakash
 *       - name: last
 *         in: formData
 *         required: true
 *         type: string
 *         value: Tyagi
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *         value: akash021tyagi@gmail.com
 *       - name: phone
 *         in: formData
 *         required: true
 *         type: integer
 *         value: 9786767567
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *         value: test
 *       - name: verify
 *         in: formData
 *         required: true
 *         type: string
 *         value: test
 *
 *     responses:
 *       200:
 *         description: login
 */
const reg = require('./nodejs/register');
app.post('/signUp', reg.register);


/**
 * @swagger
 * /logout:
 *  get:
 *    summary: log out from website
 *    description: Please make sure you have logged in using above login request, before logging out. No token required Identify user automatically
 *    responses:
 *      '200':
 *          description: success
 */
app.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.json({
        'message': 'user log out'
    });
});


/**
 * @swagger
 *
 * /forgot-pass:
 *   post:
 *     summary: Reset your password from here
 *     description: replace with your email id to reset your password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *         value: akash021tyagi@cool.com
 *     responses:
 *       200:
 *         description: forgot password
 */
//app.post('/forgot-pass', (req, res, next) => {
  //  passwordAuthOps.forgotPassword(req, res);
//});

/**
 * @swagger
 * /profile:
 *  get:
 *    summary: get user profile data
 *    description: If logged in, then execute directly, no token required
 *    responses:
 *      '200':
 *          description: success
 */
app.post('/profile', ensureAuthenticated, async function (req, res) {


    let user  = await UserData.findOne({company_id: req.body.company_id});
    await res.json({
        "userData": user,
        'message': "authenticated",
    });
});


/**
 * @swagger
 * /dashboard:
 *  get:
 *    summary: get chatbot dashboared data
 *    description: make sure that you are logged in, execute directly.
 *    responses:
 *      '200':
 *          description: success
 */
const dash = require('./routes/dashboardRoute.js');
app.post('/dashboard/:requested_bot', ensureAuthenticated, dash.dashboard);

/**
 * @swagger
 * /history:
 *  get:
 *    summary: get chatbot history data
 *    description: make sure that you are logged in, execute directly.
 *    responses:
 *      '200':
 *          description: success
 */
//app.use('/history', ensureAuthenticated, require('./routes/historyRoute.js'))

const history = require('./routes/historyRoute');
app.post('/history/:requested_bot',  ensureAuthenticated,history.his);
/**
 * @swagger
 *
 * /myChatBot:
 *   post:
 *     summary: get all chatbots of user
 *     description: need to provide company id
 *     produces:
 *       - application/json
 *     parameters:
 *       - company_id: company_id
 *         in: formData
 *         required: true
 *         value: '33d45d9010'
 *         type: string
 *     responses:
 *       200:
 *         description: Get all chatBots of user
 */
const myBot  = require('./routes/admin');
const integrate = require('./routes/integration');
const update = require('./nodejs/updateProfile');
//const forgot = require('./');
const reply = require('./nodejs/ourChatBot');
const mail = require('./nodejs/sendProblems');
const payment = require('./routes/paymentroute');
const botOps = require('./nodejs/botSupportAllOps');
const demo = require('./nodejs/demoForm');
const platform = require('./nodejs/platforms');
const forgot = require('./nodejs/passwordAuthOps');
const contactMail = require('./nodejs/mail');
const tokenDb = require('./DB/tokenVerification');
const emailVerification = require('./nodejs/emailVerification');



app.post('/myChatBot',ensureAuthenticated, myBot.myBot);


app.get('/botData/:token', myBot.botsTrainedInfo);

app.get('/deactivate', integrate.deactivate);
app.post('/deactivateUser', integrate.deactivateUser);

app.post('/integrateBot',integrate.integrate);
app.post('/trainBot', ensureAuthenticated,integrate.train);
app.post('/updateProfile', ensureAuthenticated, update.update);
app.post('/forgot-pass', passwordAuthOps.forgotPass);
app.post('/reset/:token', passwordAuthOps.reset);

app.get('/bot', reply.renderUserBot);
app.get('/ourBotChat', reply.renderOurBot);
app.post('/support', mail.mail);
app.post('/contact', contactMail.contact);



//Payment handling routes
app.post('/createPlan', payment.createPlan);
app.get('/getPlan/:category', payment.getPlans);
app.post('/createPayment', payment.createPayment);
app.post('/paymentStatus', payment.paymentStatus);
app.post('/paymentWebhook', payment.paymentWebhook);


//bot operations
app.get('/ourBot', botOps.ourBot);
app.get('/getUserBot', botOps.getUserBot);
app.post('/buyDemo', demo.buyDemo);

//ChatBot platforms handling
app.post('/whatsApp', platform.whatsApp);
app.post('/bot', platform.botComm);

//email verification

app.post('/email', emailVerification.sendVerifyMail);
app.get('/email-verify/:token', emailVerification.emailVerify);

//Affiliate options

