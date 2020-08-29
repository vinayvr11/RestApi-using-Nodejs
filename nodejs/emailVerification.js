const crypto = require('crypto');
const emailVerify = require('../DB/tokenVerification');
const nodemailer = require('nodemailer');
const signUp = require('../DB/SignupDb');
const bcrypt = require('bcryptjs');
const key = require('../nodejs/keys');
const uuid = require('uuid');
const affiliate = require('../DB/affiliateRegisterDb');


exports.sendVerifyMail = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let token = crypto.randomBytes(24).toString('hex');
    let phone = undefined;
    let name = req.body.name;
    let emailSave = undefined;
    let type = req.query.type;
    if (req.body.phone) {
        phone = req.body.phone;
    }

    console.log('request', req.query.type);
   
        emailSave = new emailVerify({
            email: email,
            password: password,
            name: name,
            token: token,
            phone: phone
        })
    
    emailSave.save()
        .then(result => {
            console.log('email verification data saved');

        })
        .catch(err => {
            console.log('email verification error', err);
        })

    contactAdmin(email, token, res);
};


function contactAdmin(email, token, res) {
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: 'vinayvraA@'
        }
    });
    let mailoption = {
        to: email,
        from: 'vr54640@gmail.com',
        subject: 'verification mail',
        text: "Verification email -" + "\n" + "https://dry-river-91831.herokuapp.com/email-verify/" + token
    };
    smtpTransport.sendMail(mailoption, function (err) {
        if (err) throw err;
        return res.json({
            message: 'Your mail has been sent',
            error:''
        })
    });
}


exports.emailVerify = (req, res) => {
    let token = req.params.token;
    emailVerify.findOne({token: token}, (err, user) => {
        if (!user) {
            console.log('Your token has been expired now');
        } else {
            let company_id = crypto.randomBytes(5).toString('hex');
            let email = user.email;
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(user.password, salt, (err, hash) => {

                if (err) throw err;
                

                    let userName = user.email.split('@');
                    let signUpSave = new signUp({
                        username: userName[0],
                        email: email,
                        password: hash,
                        company_id: company_id,
                        phone: user.phone,
                        name: user.name
                    });
                    signUpSave.save()
                        .then(result => {
                            console.log('Email verification done');
                            res.redirect('https://vinayvr11.github.io/aimemory/auth/signin')})
                        .catch(err => {
                            console.log('Error in verifying the email token', err);
                        })
                
            }));
        }
        user.remove();
    })
}
