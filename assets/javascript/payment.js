
$('#exampleInputEmail1').click(function () {
    window.alert('If you want to change Email you need to SignUp with different email');
});

$('#exampleInputPassword1').click(function () {
    window.alert('You can change your password from your profile');
});


let order_id = null;
console.log('payment is called');
document.getElementById('subscription').onclick = function (e) {
    let planId = document.getElementById('planId');
    console.log('onclick called', planId);
    fetch('/payment', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
          planId:planId.getAttribute('value')
        })
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        options.subscription_id = data.id;
        let payment = Razorpay(options);

        if(data.options != undefined){
            console.log(data);
        }

        payment.open();
        e.preventDefault();
    });


};



let options = {
  "key":"rzp_test_1VGUCx5bA5SiGQ",
    "subscription_id":"",
    "name":"AIM AI Memory",
    "description":"Chatbots",
    "handler":function (response) {
        let element = document.querySelector("#scr").setAttribute("data-order_id", order_id);
        let custom = document.getElementById('custom').setAttribute('value',response.razorpay_subscription_id);
        let payment = document.getElementById('payment').setAttribute('value', response.razorpay_payment_id);
        console.log('Order_id', response.razorpay_payment_id);
        console.log('script');
        document.querySelector("#pay").submit();
        console.log('Success route called');
  }
};