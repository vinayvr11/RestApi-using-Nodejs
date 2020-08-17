const express = require('express');
const router = express();
const fetch = require('node-fetch');
var request = require('request');
let Razorpay = require('razorpay');
const chatbotOps = require('../nodejs/chatbotOps');
const crypto = require('crypto');
const userData = require('../DB/SignupDb');
const paymentData = require('../DB/paymentDB');

exports.createPayment = function (req, res, next) {
     console.log('After calling the payment route',req.body.company_id, req.body.quantity);
    fetch('https://rzp_test_1VGUCx5bA5SiGQ:CM2rXGqFPpRYOVgmwFNpzpUb@api.razorpay.com/v1/subscriptions', {
        method: 'post',
        body: JSON.stringify({
            plan_id: req.body.planId,
            total_count: 12,
            customer_notify: 1,
            notes: {customer_id: req.body.company_id,
                    quantity: req.body.quantity}
        }),
        headers: {'Content-Type': 'application/json'},
    }).then(result => result.json())
        .then(json => {
            console.log(json);
            res.json({
                'message': 'user created',
                id: json.id
            });
        }).catch(err => {
        res.json({
            'message': 'error in creating the user'
        });
    })
}


exports.paymentStatus = async function (req, res, next) {
    const sha = crypto.createHmac('sha256', 'CM2rXGqFPpRYOVgmwFNpzpUb');
    sha.update(req.body.payment_id + '|' + req.body.subscription_id);
    const digest = sha.digest('hex');
    if (digest === req.body.signature) {
        console.log('data matched signature');
        await res.json({
            'message': 'payment success and verified',
            'error': ''
        })
    } else {
        await res.json({
            'error': 'some error occurs in payment',
            'message': ''
        });
    }
}

const buyBot = require('../nodejs/chatbotOps');
//Subscription active status
exports.paymentWebhook = async function (req, res, next) {

//    buyBot.buyChatBot(req, res);

    const secret = '12345678';
    // console.log('Our WebHooks', req.body.payload);

    const sha = crypto.createHmac('sha256', secret);
    sha.update(JSON.stringify(req.body));
    const digest = sha.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('password matched');
        let event = req.body.event;
        let email = req.body.payload.payment.entity.email;
        if (event === 'subscription.charged') {
            console.log(req.body.payload.subscription);
            if (req.body.payload.subscription.entity.notes) {
                console.log('Charged', req.body.payload.subscription.entity.notes);
            }

            paymentData.findOne({customer_id: req.body.payload.subscription.entity.id}, (err, docs) => {
                let payment = {
                    payment_id: req.body.payload.payment.entity.id,
                    entity: req.body.payload.payment.entity.entity,
                    amount: req.body.payload.payment.entity.amount,
                    currency: req.body.payload.payment.entity.currency,
                    order_id: req.body.payload.payment.entity.order_id,
                    international: req.body.payload.payment.entity.international,
                    method: req.body.payload.payment.entity.method,
                    captured: req.body.payload.payment.entity.captured,
                    card_id: req.body.payload.payment.entity.card_id,
                    status: req.body.payload.payment.entity.status,
                    currency: req.body.payload.payment.entity.currency,
                    amount_refunded: req.body.payload.payment.entity.amount_refunded,
                    captured: req.body.payload.payment.entity.captured,
                    email: req.body.payload.payment.entity.email,
                    contact: req.body.payload.payment.entity.contact,
                    customer_id: req.body.payload.payment.entity.customer_id,
                    fee: req.body.payload.payment.entity.fee,
                    tax: req.body.payload.payment.entity.tax,
                    created_at: req.body.payload.payment.entity.created_at,
                };

                if (!docs) {
                    userData.findOne({company_id: req.body.payload.subscription.entity.notes.customer_id}, (err, user) => {
                        if (!user) {
                            console.log('User not found for payment complete');
                        } else {
                            buyBot.buyChatBot(req, res);
                            let subscriptionSchema = {
                                company_id: user.company_id,
                                subscription_id: req.body.payload.subscription.entity.id,
                                entity: req.body.payload.subscription.entity.entity,
                                plan_id: req.body.payload.subscription.entity.plan_id,
                                customer_id: req.body.payload.subscription.entity.customer_id,
                                status: req.body.payload.subscription.entity.status,
                                current_start: req.body.payload.subscription.entity.current_start,
                                current_end: req.body.payload.subscription.entity.current_end,
                                charge_at: req.body.payload.subscription.entity.charge_at,
                                end_at: req.body.payload.subscription.entity.end_at,
                                start_at: req.body.payload.subscription.entity.start_at,
                                paid_count: req.body.payload.subscription.entity.paid_count,
                                expire_by: req.body.payload.subscription.entity.expire_by,
                                email: req.body.payload.subscription.entity.email,
                                contact: req.body.payload.subscription.entity.contact,
                                total_count: req.body.payload.subscription.entity.total_count,
                                paid_count: req.body.payload.subscription.entity.paid_count,
                                customer_notify: req.body.payload.subscription.entity.customer_notify,
                                created_at: req.body.payload.subscription.entity.created_at,
                                remaining_count:  req.body.payload.subscription.entity.remaining_count,
                                payments: payment
                            };

                            let paymentdata = new paymentData(subscriptionSchema);
                            paymentdata.save().then(result => {
                                console.log('Your subscription data has been saved');
                            }).catch(err => {
                                console.log('There is some problem in saving the subscription data');
                            })
                        }
                    });
                } else {
                    docs.charge_at = req.body.payload.subscription.entity.charge_at;
                    docs.paid_count = req.body.payload.subscription.entity.paid_count;
                    docs.expire_by = req.body.payload.subscription.entity.expire_by;
                    docs.current_start = req.body.payload.subscription.entity.current_start;
                    docs.current_end = req.body.payload.subscription.entity.current_end;
                    docs.start_at = req.body.payload.subscription.entity.start_at;
                    docs.end_at = req.body.payload.subscription.entity.end_at;
                    docs.reamining_count = req.body.payload.subscription.entity.remaining_count;
                    docs.payments.push(payment);
                    docs.save().then(results => {
                        console.log('Subscription charged is saved');
                    }).catch(err => {
                        console.log('Problem in subscription charged saving');
                    })
                }
            });
        }


        console.log('subscription called');
    }

    res.json({status: 'ok'});

}


router.get('/paymentPage', function (req, res, next) {


    if (req.user == undefined) {
        req.flash('message', 'Please log-in first');
        res.redirect('/');
    } else {

        if (req.user.isBuy) {
            req.flash('message', 'You have already buy our Bots if you want more then please contact to our admins');
            res.redirect('/');
        } else {

            let quantity = req.query.quantity;
            let price = req.query.price;
            let email = req.user.email;
            let phone = req.user.phone;
            let planId = req.query.planId;
            req.app.set('quantity', quantity);
            req.app.set('price', price);

            res.render('paymentRoute', {
                success: null,
                price: price,
                quantity: quantity,
                email: email,
                phone: phone,
                planId: planId
            });
        }

    }

});

const plans = require('../DB/botPlans');
exports.createPlan = (req, res) => {
    let plan = {
        planId: req.body.planId,
        amount: req.body.amount,
        planName: req.body.planName,
        billingFrequency: req.body.billingFrequency
    }

    let planSave = new plans(plan);
    planSave.save()
        .then(result => {
            res.json({
                'message': 'Your plans have been saved'
            })
        })
        .catch(err => {
            res.json({
                'message': 'Error in saving the plans'
            });
        })
}

exports.getPlans = async (req, res) => {
    let getAll = await plans.find({});
    await res.json({
        'message': 'successfully fetched all your data',
        plans: getAll
    })
}


//module.exports = router;
