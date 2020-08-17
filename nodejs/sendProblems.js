const nodemailer = require('nodemailer');

function sendProblem(req, res, message, mailId, subject) {
    console.log('called the support fun');
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: '7895933824aA'
        }
    });
    let mailoption = {
        to: mailId,
        from: "vr54640@gmail.com",
        subject: subject,
        text: "UserID: "+ mailId + "\n" + message
    };
    smtpTransport.sendMail(mailoption, function (err) {
        console.log('mail-sent');
        if (err) {
            console.log(err);
        } else {
            res.json({
                message: 'Mail has been sent'
            })
        }
    });
}


exports.mail =  function (req, res, next) {
    if(req.body.message && req.body.email && req.body.subject){
        sendProblem(req, res, req.body.message, req.body.email, req.body.subject);
        req.flash('message', 'Your Problem has been send to the admins');
        res.json({
            'message':'Your Request as been sent to the admins'
        });
    }else{
        res.json({
            'message':'Data is not correct'
        })
    }

    // res.redirect('/');
}



