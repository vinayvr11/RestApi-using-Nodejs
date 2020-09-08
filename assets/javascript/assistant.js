let socket;


// Typing dots are here
let master = document.getElementById('bot');
let dot_typing = document.createElement('div');
dot_typing.className = 'row nextLevel';
dot_typing.style.position = "relative";
dot_typing.style.bottom = "1rem";
dot_typing.style.top = "1rem";
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
secondDiv.className = 'bot-msg shadow p-3 mr-auto my-2 ml-1 text-center';
let secondInnerDiv = document.createElement("div");
secondInnerDiv.className = 'dot-typing mx-3';

firstInnerDiv.appendChild(img);
first_div.appendChild(firstInnerDiv);
secondDiv.appendChild(secondInnerDiv);
dot_typing.appendChild(first_div);
dot_typing.appendChild(secondDiv);
master.appendChild(dot_typing);

document.addEventListener('DOMContentLoaded', function () {
    socket = io('https://dry-river-91831.herokuapp.com/');
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
            dot_typing.style.display = 'flex';
            sendMessage("user", user_msg, companyID, projectID);
        }
    });
    
});


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
    middleware.style.paddingBottom = "1.5rem";

    var newDiv = document.createElement('div');
    newDiv.setAttribute("class", "row")
    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "bot-msg px-2 pt-3 mr-auto my-2 ml-1")
    var p = document.createElement('p');

    newDiv.className = 'row';

    if (sender == "user") {
        newDivInherit.className = 'user-msg justify-content-start px-2 pt-3 ml-auto my-2 ml-1';
    } else if (sender == "bot") {
        newDivInherit.className = 'bot-msg shadow justify-content-start px-2 pt-3 mr-auto my-2 ml-1';
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
    middleware.style.paddingBottom = "1.5rem";
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
    middleware.style.paddingBottom = "1.5rem";

    var firstInnerDiv = document.createElement('div');
    var emptyImageDiv = document.createElement('div');

    newDiv.setAttribute("class", "row")
    firstInnerDiv.setAttribute("class", "col-1")
    emptyImageDiv.setAttribute("class", "")

    var newDivInherit = document.createElement('div');
    newDivInherit.setAttribute("class", "pt-3 mr-auto my-2 ml-1 btns-wrapper text-center")

    btns_list.forEach(button => {
        var btn = document.createElement('button');
        btn.setAttribute("class", "btn btn-light shadow-sm m-1 btn-sm");
        btn.addEventListener('click', function () {
            let company_id = $("#Cid").attr('value');
            let project_id = $("#Pid").attr('value');
            update_message('user', this.innerText);
            $('.btns-wrapper').hide();
            dot_typing.style.display = 'flex';
            sendRequest(this.innerText, company_id, project_id);
        });
        if (type === 'welcome') {
            console.log("Button text..........", button)
            btn.innerText = button.btn;
        } else {
            console.log('error in update buttons.........', button);
            btn.innerText = button.structValue.fields.btn.stringValue;
        }
        newDivInherit.appendChild(btn);
    });

    firstInnerDiv.appendChild(emptyImageDiv);
    newDiv.appendChild(firstInnerDiv);
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
    middleware.style.paddingBottom = "1.5rem";


    newDiv.setAttribute("class", "testimonial-group mt-5 mx-0 px-0");
    newDiv.style.paddingBottom = "4rem";
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
                tab.scrollTop = tab.scrollHeight + 1000;

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
          //  try {
            let payloads;
            console.log("user data")
              if (data.answer) {
                payloads  = data.answer.fulfillmentMessages;
              
                
                // console.log(payloads[0].payload.fields.msg);
                console.log("Logs in payloads", payloads);
               // payloads.forEach(element => {
                    //console.log('Your famous text', payloads[0].payload.fields.msg);
                    if (data.type === 'welcome') {
                        beforeWelcome(payloads, data.type);
                    } else {
                        afterWelcome(payloads);
                    }
                }
               // });

          //  } catch (err) {
                // update_message("bot", data.answerChat.response)
            //    console.log('inside error called', data)
           // }
        }
    }
}

beforeWelcome = (element, type) => {
    console.log('welcome message called', element);


    var tab = document.getElementById('bot');
    let length = element.length;
    let i = 0;

    let interval =  setInterval(function () {
    if (i >= length) {
            console.log('length is smaller found');
            dot_typing.style.display = 'none';
            clearInterval(interval);
    } else { 
    if (element[i].msg) {
        let bot_msg = element[i].msg;
        console.log("msg:", bot_msg)
    
            update_message("bot", bot_msg)
            i++;

    } else if (element[i].img) {
        console.log("img:", element[i].img)
       
            dot_typing.style.display = 'flex';
      
            update_img(element[i].img)
            i++;

    } else if (element[i].cards) {
        console.log("found cards", element[i].cards)
        
            dot_typing.style.display = 'flex';
      

            update_cards(element[i].cards, type)
            i++;

    } else if (element[i].btns) {
        bot_btns = element[i].btns;
        console.log("btns:", bot_btns)
      
            update_btns(bot_btns, type)
       i++;
    }
    }
}, 1500);
}


afterWelcome =  (element) => {
    console.log("Messages...................+++++++++++++", element[0].length);
    var tab = document.getElementById('bot');
    let length = element.length;
    let i = 0;

    let interval =  setInterval(function () {
    if (i >= length) {
        console.log('length is smaller found');
        dot_typing.style.display = 'none';
        clearInterval(interval);
    } else { 
        console.log("Messages...................+++++++++++++", element[i]);

     if (element[i].payload.fields.msg) {
        console.log("Messages...................+++++++++++++", element[i]);

        let bot_msg = element[i].payload.fields.msg.stringValue
        console.log("msg:", bot_msg)
        update_message("bot", bot_msg)
        if (i !== length - 1) {
            dot_typing.style.display = 'flex';
            tab.scrollTop = tab.scrollHeight;

        }
        i++;

    } else if (element[i].payload.fields.img) {
        console.log("Messages...................+++++++++++++", element[i]);

        //console.log("img:", element[0].payload.fields.img.stringValue)
        update_img(element[i].payload.fields.img.stringValue)
        if (i !== length - 1) {
            dot_typing.style.display = 'flex';
            tab.scrollTop = tab.scrollHeight;

        }
        i++;

    } else if (element[i].payload.fields.cards) {
        console.log("Messages...................+++++++++++++", element[i]);

        //console.log("found cards", element[0].payload.fields.cards.listValue.values)
        update_cards(element[i].payload.fields.cards.listValue.values, 'regular')
        if (i !== length - 1) {
            dot_typing.style.display = 'flex';
            //tab.scrollTop = tab.scrollHeight;

        }
        i++;
    } else if (element[i].payload.fields.btns) {
        console.log("Messages...................+++++++++++++", element[i]);

        bot_btns = element[i].payload.fields.btns.listValue.values
        console.log("btns:", bot_btns)
        update_btns(bot_btns, 'regular')
        if (i !== length - 1) {
            dot_typing.style.display = 'flex';
            tab.scrollTop = tab.scrollHeight;
        }
        i++;
    }
}

    }, 1500)
}




