const UserData = require('../DB/SignupDb');
const chatbot = require('../nodejs/chatbotOps');
const userCredData = require('../DB/userCredDb');
const UserCredObj = require('../nodejs/allObjects');
const chatData = require('../DB/chatDb');
const demoChatDB = require('../DB/demoChatDB');
const mail = require('../nodejs/mail');


exports.buyDemo = (req, res) => {

    let company_id = req.body.company_id;
    let query = {company_id: company_id};
    console.log("Your email-id: ", company_id);
    const result = UserData.findOne(query, (err, user) => {
        if (!user) {
            return res.json({
                'error': "No user exist of this id"
            })
        } else {

            if (user.isBuy) {
                //console.log('You have buy our demo');
                return res.json({
                    'error': 'You have already buy our bots'
                });
                // return false;
            }
            if (user.isDemo) {
                console.log('You have already taken our demo');
                return res.json({
                    'error': 'You have already buy our demo'
                })
                //return false;
            } else {
                let today = new Date();
                let date = today.getDate();
                let str = date;
                user.demo_start_date = Date();

                let start = new Date();
                let next = new Date();
                next.setDate(start.getDate() + 10);
                console.log('your demo end date', next);
                demoChat(req, res);
                user.demo_end_date = new Date(next);

                user.isDemo = true;
                user.save().then(res => {
                    console.log('Demo date have been saved');
                }).catch(err => {
                    console.log('There is some error in saving the demo date');
                   return res.json({
                        'error': 'You have successfully buy our demo'
                    })
                })
            }
        }
    });
}


demoChat = async (req, res) => {
    //Assigning the bot to the user after payment
    console.log();
    await UserData.findOne({company_id: req.body.company_id}, function (err, user) {
        if (!user) {
            return res.json({
                'error': 'You have submitted wrong credentials'
            })
        } else {
            userCredData.findOneAndUpdate({isAssigned: false}, {isAssigned: true}, function (err, doc) {
                if (err) throw err;
                if (doc === null) {
                    console.log('Data is not found');
                    return res.json({
                        'error': 'There is some issue in our servers'
                    });
                } else {
                    console.log('User submitted domain', doc.project_id);
                    user.demoPId = doc.project_id;
                    user.save();
                    let arr = [];
                    let bots = {
                        projectId: doc.project_id,
                    }
                    arr.push(bots);
                    let demoChat = new demoChatDB({
                        company_id: user.company_id,
                        isActive: true,
                        botChats: arr
                    });

                    demoChat.save().then(result => {
                        console.log('Your demochats are saved');
                        //mail.sendMail(user.email, 'Successfully accquired our demo', 'You have accquire our 10 days demo.');
                        mail.support(req, res);
                        return res.json({
                            'message': 'You have successfully buy our demo',
                            'userData': user
                        })
                    }).catch(err => {
                        console.log('You got some error in saving the demo chats db', err);
                        return res.json({
                            'error': 'You have successfully buy our demo'
                        })
                    });
                }
            });
        }
    });
}


//module.exports = DemoForm;
