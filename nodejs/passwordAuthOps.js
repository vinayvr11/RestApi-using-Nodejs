const nodemailer = require('nodemailer');
const crypto  = require('crypto');
const UserData = require('../DB/SignupDb');
const async = require('async');
const bcrypt = require('bcryptjs');
const { resolveSoa } = require('dns');



exports.forgotPass = (req, res, next) => {
    PasswordAuth.forgotPassword(req, res);
};

exports.reset = function (req, res) {
    PasswordAuth.reset(req, res);
}
class PasswordAuth {

    static forgotPassword(req, res) {

        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    let token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                UserData.findOne({email: req.body.email}, function (err, user) {
                    if (!user) {
                        res.json({
                           'message':'User not exist with this email id'
                        });
                       // return res.redirect('/');
                    }else{
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000;
                    user.save(function (err) {
                        done(err, token, user);
                    });
                    res.json({
                        'message':'Mail has been sent at your gmail id'
                    })
                }
                });
            },
            function (token, user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'vr54640@gmail.com',
                        pass: '7895933824aA'
                    }
                });
                //req.headers.host
                let mailoption = {
                    to: user.email,
                    from: 'vr54640@gmail.com',
                    subject: 'Password reset mail',
                    text: 'http://localhost:4200/resetpassword/' + token
                };
                smtpTransport.sendMail(mailoption, function (err) {
                    console.log('mail-sent');
                    res.json({
                        'message':'mail has been sent'
                    });
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) throw err;
            res.redirect('/forgot-pass-form');
        });

    }


    static reset(req, res) {
        console.log('User params token: ', req.params.token);

        async.waterfall([

            function (done) {
            if (req.body.password === req.body.verify) {
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(req.body.password, salt, function (err, hash) {
                    let update = {password: hash};
                    let filter = {resetPasswordToken: req.params.token};
                    UserData.findOneAndUpdate(filter, update, function (err, user) {
                        if (err) throw err;
                        console.log('Your password has been updated');
                        res.json({
                            "message": "Password updated"
                        })
                    })
                }))
            } else {
                res.json({
                    'message': 'Password not matched'
                })
            }
            }, function (user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'vr54640@gmail.com',
                        pass: '7895933824aA'
                    }
                });
                let mailOptions = {
                    to: user.email,
                    from: 'vr54640@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'This is a configuration that the password for your account' + user.email + 'has just been changed.'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err);
                });
            }

        ], function (err, result) {
            if (err) throw err;
            console.log('You have Successfully reset the password');
            //req.flash('message','Your password now has been reset..');
            res.json({
                'message':'Your password has been reset'
            });

        });
    }
}

//module.exports = PasswordAuth;
