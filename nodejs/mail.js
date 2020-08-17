const nodemailer = require('nodemailer');
const key = require('../nodejs/keys');

function contactAdmin(req, res) {
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: key.pass
        }
    });
    let mailoption = {
        to: 'vr54640@gmail.com',
        from: 'vr54640@gmail.com',
        subject: req.body.subject,
        text:   "User name" + req.body.name + "User message" + req.body.message + "user phone number- " + " " + req.body.phone
    };
    smtpTransport.sendMail(mailoption, function (err) {
        res.json({
            'message': 'Your mail has been sent'
        })
    });
}

function sendMail(user, subject, text) {
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: key.pass
        }
    });
    let mailoption = {
        to: user,
        from: 'vr54640@gmail.com',
        subject: subject,
        text:   text
    };
    smtpTransport.sendMail(mailoption, function (err) {

    });
}


function support(req, res, next) {

        console.log('called the support fun');
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vr54640@gmail.com',
                pass: key.pass
            }
        });
        let mailoption = {
            to: "vr54640@gmail.com",
            from: "vr54640@gmail.com",
            subject: 'Demo request',
            text: "UserID: "+ req.body.company_id + "\n"+ "User Project Id" + "\n" + "company_id" + req.body.name + "\n" +
                "Phone number" + req.body.phone
        };
        smtpTransport.sendMail(mailoption, function (err) {
            console.log('mail-sent');
            if (err) {
                console.log(err);
            } else {
                res.json({
                    'message': 'Sent mail'
                })
            }
        });


}

module.exports = {sendMail:sendMail,
                    support: support,
                    contact: contactAdmin};
