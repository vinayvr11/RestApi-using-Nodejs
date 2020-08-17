const affiliate = require('../DB/affiliateRegisterDb');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
function signUpAffiliate (req, res) {
    affiliate.findOne({email: req.body.email} , (user, err) => {
        if (user) {
            res.json({
                'error': 'User is already registered'
            })
        } else {
            let aid = uuid.v4();
            let affiliateData = {

                affiliateId: aid,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                shareUrl: 'https://significantbots.com/?aid='+aid,
                password: undefined,
            }
            bcrypt.genSalt(11, (err, salt)=> bcrypt.hash(req.body.password, salt, (err, hash)=>{

                if(err) throw err;

                data.password = hash;
                res.clearCookie('cookie');
                //remember to make the key as env variable-
                let crypt = crypto.randomBytes(5).toString('hex');
                res.cookie('client_cookie', crypt, {httpOnly: true});
                data.company_id = crypt;
                user.save()
                    .then(user =>{
                        req.flash('message', 'You are now registered and can log in');
                        mail.sendMail(req.body.email, 'Registered Successfully','You have successfully register with our company.');
                        res.json({
                            'message':'User registered successfully'
                        });
                        //res.redirect('/');
                    })
                    .catch(err => console.log(err));
            }));
        }
    })
}


module.exports = {
    signUp: signUpAffiliate,

}
