let socket;
let dot_typing = document.getElementById('nextLevel');
dot_typing.style.display = 'none';
document.addEventListener('DOMContentLoaded', function () {
    socket = io('https://botscuadapi.herokuapp.com');
    let company_id = $("#Cid").attr('value');
    let project_id = $("#Pid").attr('value');
    socket.emit('welcome', {company_id: company_id, project_id: project_id});
    socket.once('welcomeMessage', data => {
        console.log('client welcome message called');
        botData(data);
    })
    console.log('Function has been called');
    var tab = document.getElementById('div');
    var newDiv = document.createElement('div');
    var newDivInherit = document.createElement('div');
    var getText = $('#myInput');

    let i = 0;
    getText.keypress(function (event) {
        if (event.keyCode == '13') {
            console.log('Your user who sends message url: ');
            let companyID = $('#Cid').attr('value');
            let projectID = $('#Pid').attr('value');
            let user_msg = getText.val();
            document.getElementById('myInput').value = "";
            console.log('My message', user_msg);
            dot_typing.style.display = 'block';
            sendMessage("user", user_msg, companyID, projectID);
        }
    });
    //  loading();
});

/*function loading(){
    let dateInfo = getDateInfo();

    let company_id = $('#Cid').attr('value');
    let project_id = $('#Pid').attr('value');

    fetch('/checkDemo', {
       method: 'POST',
        headers: {
           "Content-Type":"application/json"
        },
        body: JSON.stringify({
            year: dateInfo.year,
            month: dateInfo.month,
            date: dateInfo.date,
            company_id:company_id,
            project_id:project_id
        })
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data.answer);
    });
}*/

function getDateInfo() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    return {
        year: year,
        month: month,
        date: date,
    }
}


function update_message(sender, msg) {
    var tab = document.getElementById('bot');
    var middleware = document.getElementById('middleware');

    var newDiv = document.createElement('div');
    newDiv.setAttribute("class", "row")
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "bot-msg px-2 pt-3 mr-auto my-2 ml-1")
    var p = document.createElement('p');

    newDiv.className = 'row';

    if (sender == "user") {
        newDivInherit.className = 'user-msg justify-content-start px-2 pt-3 ml-auto my-2 ml-1';
    } else if (sender == "bot") {
        newDivInherit.className = 'bot-msg justify-content-start px-2 pt-3 mr-auto my-2 ml-1';
        dot_typing.style.display = 'none';
    }
    console.log('Your message', msg);
    let text = msg;
    p.innerText = text;
    newDivInherit.appendChild(p);
    newDiv.appendChild(newDivInherit);
    middleware.appendChild(newDiv);
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;

}

function update_img(img_link) {
    var tab = document.getElementById('bot');
    var newDiv = document.createElement('div');
    var middleware = document.getElementById('middleware');
    newDiv.setAttribute("class", "row")
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "img-container px-2 pt-3 mr-auto my-2 ml-1")
    var img = document.createElement('img');

    img.setAttribute('src', img_link)
    img.setAttribute('class', "img-responsive shadow")
    img.setAttribute('style', "border-radius: 15px;")

    newDivInherit.appendChild(img);
    newDiv.appendChild(newDivInherit);
    middleware.appendChild(newDiv);
    dot_typing.style.display = 'none';
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;


}

function update_btns(btns_list, type) {
    console.log(btns_list)
    var tab = document.getElementById('bot');
    var newDiv = document.createElement('div');
    var middleware = document.getElementById('middleware');

    newDiv.setAttribute("class", "row")
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "pt-3 mr-auto my-2 ml-1 btns-wrapper text-center")

    btns_list.forEach(button => {
        var btn = document.createElement('button');
        btn.setAttribute("class", "btn btn-light shadow-sm m-1 btn-sm");
        btn.addEventListener('click', function () {
            let company_id = $("#Cid").attr('value');
            let project_id = $("#Pid").attr('value');
            update_message('user', this.innerText);
            dot_typing.style.display = 'block';
            sendRequest(this.innerText, company_id, project_id);
        });
        if (type === 'welcome') {
            btn.innerText = button;
        } else {
            console.log('error in update buttons.........', button);
            btn.innerText = button.structValue.fields.btn.stringValue;
        }
        newDivInherit.appendChild(btn);
    });

    newDiv.appendChild(newDivInherit);
    middleware.appendChild(newDiv);
    dot_typing.style.display = 'none';
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;
}

function update_cards(cards_list, type) {

    var tab = document.getElementById('bot');
    var newDiv = document.createElement('div');
    var middleware = document.getElementById('middleware');

    newDiv.setAttribute("class", "testimonial-group mt-5 mx-0 px-0");
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "slider-row row text-center flex-nowrap mx-0")

    cards_list.forEach(element => {
        var col = document.createElement('div');
        col.setAttribute("class", "col px-0")
        var cardElement = document.createElement('div');
        cardElement.setAttribute("class", "card mr-3")
        cardElement.setAttribute("style", "width: 18rem;")

        let card, title, subtit, text, img_link, card_links;
        if (type === 'welcome') {
            card = element;
            title = card.cardTitle,
                subtit = card.cardSubTitle,
                text = card.cardText,
                img_link = card.img,
                card_links = card.cardLinks
        } else {
            card = element.structValue.fields;
            title = card.cardTitle.stringValue,
                subtit = card.cardSubTitle.stringValue,
                text = card.cardText.stringValue,
                img_link = card.img.stringValue,
                card_links = card.cardLinks.listValue.values
        }
        console.log("cardLinks:", card.cardLinks.listValue.values)

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
        let length = card_links.length;
        let count = 0;
        console.log('cards..................length', length);
        card_links.forEach(element => {
            count++;
            console.log("cards elements", element);
            if (count <= length) {
                var cardlink = document.createElement('a');
                cardlink.setAttribute('class', "card-link")
                cardlink.setAttribute('href', "#")

                if (type === 'welcome') {
                    if (typeof element === 'object') {
                        cardlink.innerText = element.text
                        console.log('card object checking.........', element);

                        cardlink.setAttribute('href', element.link);
                    } else {
                        cardlink.innerText = element;
                    }
                } else {
                    console.log('card links checking.........', element);

                    cardlink.innerText = element.structValue.fields.text.stringValue;
                    cardlink.setAttribute('href', element.structValue.fields.link.stringValue);
                }
                cardbody.appendChild(cardlink);
            }

    });

    cardElement.appendChild(cardbody);
    col.appendChild(cardElement);
    newDivInherit.appendChild(col);

    newDiv.appendChild(newDivInherit);
    middleware.appendChild(newDiv);
    dot_typing.style.display = 'none';
    tab.prepend(middleware);
    tab.scrollTop = tab.scrollHeight;
}

)
;

}

function sendMessage(sender, message, company_id, project_id) {
    update_message(sender, message)
    sendRequest(message, company_id, project_id);
}


function sendRequest(message, companyID, projectID) {


    let text = message;
    console.log('your data', message, projectID, companyID);
    socket.emit('userBotConnect', {
        text: message,
        cookie: socket.id,
        company_id: companyID,
        project_id: projectID,
        platform: "website"
    });
    socket.once('userAnswer', data => {
        console.log('data', data.answer);
        botData(data);
    });
}

function botData(data) {
    console.log('ttype', data.type);
    if (data.type === "demo") {
        update_message("bot", "Sorry we are out of service now.");
    } else {
        console.log('demo else condition enter');
        if (data.answer && data.answer.fulfillmentText) {
            let bot_msg = data.answer.fulfillmentText;
            console.log("msg:", bot_msg)
            update_message("bot", bot_msg)
        } else {
            try {
                let payloads = data.answer.fulfillmentMessages;
                // console.log(payloads[0].payload.fields.msg);
                console.log("Logs in payloads", payloads);
                payloads.forEach(element => {
                    //console.log('Your famous text', payloads[0].payload.fields.msg);
                    if (data.type === 'welcome') {
                        beforeWelcome(element, data.type);
                    } else {
                        afterWelcome(element);
                    }
                });

            } catch (err) {
                // update_message("bot", data.answerChat.response)
                console.log('inside error called', data)
            }
        }
    }
}

beforeWelcome = (element, type) => {
    console.log('welcome message called');
    if (element.msg) {
        let bot_msg = element.msg;
        console.log("msg:", bot_msg)
        setTimeout( function () {
            dot_typing.style.display = 'block';
        }, 4000);
        setTimeout( function () {
            update_message("bot", bot_msg)
        }, 5000);
    } else if (element.img) {
        console.log("img:", element.img)
        setTimeout( function () {
            dot_typing.style.display = 'block';
        }, 2000);
        setTimeout(function () {

            update_img(element.img)
        }, 3000);
    } else if (element.cards) {
        console.log("found cards", element.cards)
        setTimeout( function () {
            dot_typing.style.display = 'block';
        }, 3000);
        setTimeout(function () {

            update_cards(element.cards, type)
        }, 6000);
    } else if (element.btns) {
        bot_btns = element.btns;
        console.log("btns:", bot_btns)
        setTimeout( function () {
            dot_typing.style.display = 'block';
        }, 6000);
        setTimeout(function () {

            update_btns(bot_btns, type)
        }, 7000);
    }
}

afterWelcome = (element) => {
    if (element.payload.fields.msg) {
        let bot_msg = element.payload.fields.msg.stringValue
        console.log("msg:", bot_msg)
        update_message("bot", bot_msg)
    } else if (element.payload.fields.img) {
        console.log("img:", element.payload.fields.img.stringValue)
        update_img(element.payload.fields.img.stringValue)
    } else if (element.payload.fields.cards) {
        console.log("found cards", element.payload.fields.cards.listValue.values)
        update_cards(element.payload.fields.cards.listValue.values, 'regular')
    } else if (element.payload.fields.btns) {
        bot_btns = element.payload.fields.btns.listValue.values
        console.log("btns:", bot_btns)
        update_btns(bot_btns, 'regular')
    }
}




