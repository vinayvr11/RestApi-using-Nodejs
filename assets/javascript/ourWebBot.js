console.log("our WebBot.js called");
let socket = io('https://lit-lowlands-81249.herokuapp.com/');

let welcome = {
    answer: {
        fulfillmentMessages: [
            {
                img: '../assets/images/hello_c.png'
            },
            {
                msg: "Do you know, chatbots will help businesses save $8 billion/year by 2022.",
            },
            {
                msg: "Hi i am neesha and i am here to help you know our services."
            },
            {
                btns: ["Continue", "free trial", "Why us?"]

            }
        ]
    }
}
let master = document.getElementById('bot');
let dot_typing = document.createElement('div');
dot_typing.className = 'row nextLevel';
dot_typing.id = 'row';
let first_div = document.createElement("div");
first_div.className = 'col-1';
first_div.id = 'level';

let firstInnerDiv = document.createElement("div");
firstInnerDiv.className = 'row';
let img = document.createElement('img');
img.setAttribute('src', '/assets/images/logo.png');
img.className = 'rounded-circle mt-4';
img.setAttribute('height', '30');
img.setAttribute('width', '30');


let secondDiv = document.createElement("div");
secondDiv.className = 'bot-msg p-3 mr-auto my-2 ml-1 text-center';
let secondInnerDiv = document.createElement("div");
secondInnerDiv.className = 'dot-typing mx-3';

firstInnerDiv.appendChild(img);
first_div.appendChild(firstInnerDiv);
secondDiv.appendChild(secondInnerDiv);
dot_typing.appendChild(first_div);
dot_typing.appendChild(secondDiv);
master.appendChild(dot_typing);
//dot_typing.style.display = 'none';
document.addEventListener('DOMContentLoaded', function () {
    $('.buttons').click(function () {
        var btn = $(this).value;
        console.log('Value', btn);
    });

    var getText = $('#myInput');
    let i = 0;
    botAnswer("bot", welcome);
    let tab = document.getElementById('bot');
    getText.keypress(function (event) {

        if (event.keyCode == '13') {
            console.log('clicked event into enter');
            user_msg = getText.val();
            document.getElementById('myInput').value = "";
            dot_typing.style.display = 'flex';
            sendMessage("user", user_msg)
        }
    })

});


function update_message(sender, msg) {


    var tab = document.getElementById('bot');
    var middleware = document.getElementById('middleware');
    var newDiv = document.createElement('div');
    var imgColDiv = document.createElement('div');
    var imgRowDiv = document.createElement('div');
    var logo = document.createElement('img');


    newDiv.setAttribute("class", "row")
    imgColDiv.setAttribute("class", "col-1")
    imgRowDiv.setAttribute("class", "row")
    logo.setAttribute("class", "rounded-circle mt-4")
    logo.setAttribute('src', "/assets/images/logo.png")
    logo.setAttribute('height', "20")
    logo.setAttribute('width', "20")

    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "bot-msg px-4 pt-3 mr-auto my-2 ml-1")
    var p = document.createElement('p');

    newDiv.className = 'row';

    if (sender == "user") {
        newDivInherit.className = 'user-msg justify-content-start shadow-sm px-2 pt-3 ml-auto my-2 ml-1';
        tab.scrollTop = tab.scrollHeight;

    } else if (sender == "bot") {
        newDivInherit.className = 'bot-msg justify-content-start shadow-sm px-2 pt-3 mr-auto my-2 ml-1';
        dot_typing.style.display = 'none';
    }
    console.log('Your message', msg);
    let text = msg;
    p.innerText = text;
    //dot.style.display = 'none';
    imgRowDiv.appendChild(logo);
    imgColDiv.appendChild(imgRowDiv);
    newDiv.appendChild(imgColDiv);
    newDiv.setAttribute("data-aos", "fade-up")


    newDivInherit.appendChild(p);
    newDiv.appendChild(newDivInherit);
    middleware.appendChild(newDiv);
    console.log("Your dot_typing height --------=======", middleware.scrollHeight);

    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;
}

function update_img(sender, img_link) {
    var tab = document.getElementById('bot');
    var middleware = document.getElementById('middleware');

    var newDiv = document.createElement('div');
    newDiv.setAttribute("class", "row")
    var newDivInherit = document.createElement('div'); // data-aos="fade-up"
    newDivInherit.setAttribute("class", "img-container px-2 pt-3 mr-auto my-2 ml-1")

    var img = document.createElement('img');

    img.setAttribute('src', img_link)
    img.setAttribute('class', "img-responsive shadow")
    img.setAttribute('style', "border-radius: 15px;")

    newDivInherit.appendChild(img);
    newDiv.appendChild(newDivInherit);
    newDiv.setAttribute("data-aos", "fade-up")


    middleware.appendChild(newDiv);
    dot_typing.style.display = 'none';
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;


}

function update_btns(user, btns_list) {
    console.log("all_btns", user)
    var tab = document.getElementById('bot');
    var middleware = document.getElementById('middleware');
    var newDiv = document.createElement('div');
    var firstInnerDiv = document.createElement('div');
    var emptyImageDiv = document.createElement('div');


    newDiv.setAttribute("class", "row")
    firstInnerDiv.setAttribute("class", "col-1")
    emptyImageDiv.setAttribute("class", "")
    

    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "col-11 pt-3 mr-auto my-2 ml-1 btns-wrapper text-center")

    btns_list.forEach(a_button => {
        var btn = document.createElement('button');
        btn.setAttribute("class", "btn btn-outline-dark shadow-sm btn-lg btn-block")
        btn.addEventListener('click', function () {
            update_message('user', this.innerText);
            dot_typing.style.display = 'flex';

            sendRequest('user', this.innerText);
        });
        if (user === 'dialogflow') {
            console.log("a_button", a_button);
            btn.innerText = a_button.structValue.fields.btn.stringValue;
        } else {
            btn.innerText = a_button;
        }
        newDivInherit.appendChild(btn);
    });

    firstInnerDiv.appendChild(emptyImageDiv);
    newDiv.appendChild(firstInnerDiv);
    newDiv.appendChild(newDivInherit);
    newDiv.setAttribute("data-aos", "fade-up")


    middleware.appendChild(newDiv);
    dot_typing.style.display = 'none';
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;
}

function update_cards(sender, cards_list) {

    var tab = document.getElementById('bot');
    var middleware = document.getElementById('middleware');

    var newDiv = document.createElement('div');
    newDiv.setAttribute("class", "testimonial-group mt-5 mx-0 px-0");
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "slider-row row text-center flex-nowrap mx-0")

    cards_list.forEach(element => {
        var col = document.createElement('div');
        col.setAttribute("class", "col px-0")
        var cardElement = document.createElement('div');
        cardElement.setAttribute("class", "card mr-3")
        cardElement.setAttribute("style", "width: 18rem;")
        console.log('called inside the card.........');

        let card, title, subtit, text, img_link, card_links;
        if (sender === 'user') {
            console.log('enter inside the user panel.............');
            card = element.structValue.fields;
            title = card.cardTitle.stringValue;
            subtit = card.cardSubTitle.stringValue;
            text = card.cardText.stringValue;
            img_link = card.img.stringValue;
            card_links = card.cardLinks.listValue.values;
        } else {
            console.log('enter inside the bot panel.............');
            card = element;
            title = card.cardTitle;
            subtit = card.cardSubTitle;
            text = card.cardText;
            img_link = card.img;
            card_links = card.cardLinks
        }


        //console.log("element:", card.cardTitle)

        var img = document.createElement('img');
        img.setAttribute('src', img_link)
        img.setAttribute("class", "card-img-top")
        cardElement.appendChild(img);

        var cardbody = document.createElement('div');
        cardbody.setAttribute("class", "card-body")
        var cardTitle = document.createElement('h5');
        cardTitle.setAttribute('class', "card-title")
        cardTitle.innerText = title;
        cardbody.appendChild(cardTitle);

        var cardSubTitle = document.createElement('h6');
        cardSubTitle.setAttribute("class", "card-subtitle mb-2 text-muted")
        cardSubTitle.innerText = subtit;
        cardbody.appendChild(cardSubTitle);

        var cardText = document.createElement('p');
        cardText.setAttribute('class', "card-text")
        cardText.innerText = text;
        cardbody.appendChild(cardText);

        card_links.forEach(element => {
            var cardlink = document.createElement('a');
            cardlink.setAttribute('class', "card-link")
            cardlink.setAttribute('href', "#")
            if (sender === 'user') {
                cardlink.innerText = element.structValue.fields.text.stringValue;
                cardlink.setAttribute('href', element.structValue.fields.link.stringValue);
            } else {
                cardlink.innerText = element.text;
                cardlink.setAttribute('href', element.link)
            }

            cardbody.appendChild(cardlink);
        });

        cardElement.appendChild(cardbody);
        col.appendChild(cardElement);
        newDivInherit.appendChild(col);

        newDiv.appendChild(newDivInherit);
        middleware.appendChild(newDiv);
        newDiv.setAttribute("data-aos", "fade-up")

        dot_typing.style.display = 'none';
        tab.prepend(middleware);
        tab.scrollTop = tab.scrollHeight;
    });
}

function sendMessage(sender, message) {


    update_message(sender, message);
    sendRequest(sender, message);


}


function sendRequest(sender, message) {
    //let cookie = localStorage.getItem("key");
    //console.log(message);
    let text = message;
    var tab = document.getElementById('bot');
    tab.scrollTop = tab.scrollHeight;
    socket.emit('botConnect', {text: text, cookie: socket.id});
    socket.once('answer', data => {
        console.log('data', data.answer.fulfillmentText);
        answerCategory(sender, data, dot_typing);

    });

}

answerCategory = (sender, data) => {
    console.log('Testing the user data.................', data.answer.fulfillmentMessages.length);
    if (data.answer.fulfillmentText) {
        let bot_msg = data.answer.fulfillmentText;
        console.log("msg:", bot_msg);
        update_message("bot", bot_msg)
    } else {
        try {
            let payloads = data.answer.fulfillmentMessages;
            console.log('checking your payload ..................', payloads);
            dialogFlowAnswer(sender, data);

        } catch (err) {
            update_message("bot", data.answerChat.response)
        }
    }
}


dialogFlowAnswer = (sender, data) => {
    let length = data.answer.fulfillmentMessages.length;
    let i = 1;
    let element = data.answer.fulfillmentMessages;
    console.log('Testing the user data element.................', element);
    var tab = document.getElementById('bot');

    let interval = setInterval(function () {

        console.log('value of I-------------', i);
        if (i >= length) {
            console.log('length is smaller found');
            dot_typing.style.display = 'none';
            clearInterval(interval);
        } else {
            let dot = document.getElementById('nextLevel');
            //dot_typing.style.display = 'none';
            console.log('payloads elements checking ..........................', element[i]);
            if (element[i].payload.fields.msg) {
                let bot_msg = element[i].payload.fields.msg.stringValue;
                console.log("msg:");
                update_message("dilaogflow", bot_msg)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;
                }                // update_message("bot", bot_msg)
            } else if (element[i].payload.fields.img) {
                console.log("img:", element[i].payload.fields.img.stringValue)


                update_img(sender, element[i].payload.fields.img.stringValue)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;
                }

            } else if (element[i].payload.fields.cards) {
                console.log("found cards", element[i].payload.fields.cards.listValue.values)


                update_cards(sender, element[i].payload.fields.cards.listValue.values)

                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;
                }
            } else if (element[i].payload.fields.btns) {
                let bot_btns = element[i].payload.fields.btns.listValue.values
                console.log("btns:", bot_btns)

                update_btns("dialogflow", bot_btns)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;
                }
            }
        }
        i++;
    }, 1500)
}

botAnswer = async (sender, element) => {
    let payloads = element.answer.fulfillmentMessages;
    var tab = document.getElementById('bot');

    let length = payloads.length;
    let i = 0;

    let interval = setInterval(function () {
        if (i >= length) {
            console.log('length is smaller found');
            dot_typing.style.display = 'none';
            clearInterval(interval);

        } else {
            dot_typing.style.display = 'none';
            if (payloads[i].msg) {
                let bot_msg = payloads[i].msg;
                console.log("msg:", bot_msg)
                update_message("bot", bot_msg)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;

                }


                // update_message("bot", bot_msg)
            } else if (payloads[i].img) {
                console.log("img:", payloads[i].img)


                update_img(sender, payloads[i].img)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;

                }


                //update_img(sender, element.img)
            } else if (payloads[i].cards) {
                console.log("found cards", payloads[i].cards)


                update_cards(sender, payloads[i].cards)

                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;

                }

                // update_cards(sender, element.cards)
            } else if (payloads[i].btns) {
                let bot_btns = payloads[i].btns
                console.log("btns:", bot_btns)

                update_btns("bot", bot_btns)
                if (i !== length - 1) {
                    dot_typing.style.display = 'flex';
                    tab.scrollTop = tab.scrollHeight;

                }


                //update_btns(sender ,bot_btns)
            }
        }
        i++;
    }, 1500)


}


