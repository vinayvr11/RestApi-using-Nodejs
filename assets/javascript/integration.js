document.addEventListener('DOMContentLoaded',  function () {


    let images = {
        website:'https://img.icons8.com/cute-clipart/480/000000/telegram-app.png',
        whatsapp:'https://img.icons8.com/color/480/000000/whatsapp.png',
        messenger:'https://img.icons8.com/color/480/000000/facebook-messenger.png',
        telegram:'https://img.icons8.com/cute-clipart/480/000000/telegram-app.png',
        slack:'https://img.icons8.com/color/480/000000/slack-new.png'
    };

     fetch('/data').then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        let length = data.data.allBots.length;
        let chatbots = document.getElementById('chatbots');
        for(let i=0;i<length;i++){
                let div = document.createElement('div');
                div.className = 'card mb-3 col-md-6';
                div.style.maxWidth = '540px';
               // div.setAttribute('width', '18rem');
                let div1 = document.createElement('div');
                div1.className = 'row no-gutters';

                let contentDiv = document.createElement('div');
                contentDiv.className = 'col-md-8';
                let cardDiv = document.createElement('div');
                cardDiv.className = 'card-body center';
                let centerDiv = document.createElement('div');

                    let h5 = document.createElement('h5');
                    h5.className = 'card-title';
                    h5.innerText = 'ChatBot: '+data.data.allBots[i].botName;
            let p1 = document.createElement('p');
            p1.className = 'card-text';
            p1.innerText = 'Status: '+data.data.allBots[i].status;
            let p2 = document.createElement('p');
            p2.className = 'card-text';
            p2.innerText = 'Training Status: '+data.data.allBots[i].trainingStatus;
            let p3 = document.createElement('p');
            p3.className = 'card-text platform';
            p3.innerText = 'Platform: '+data.data.allBots[i].botPlatform;
            let p4 = document.createElement('p');
            p4.className = 'card-text';
            p4.innerText = 'Category: '+data.data.allBots[i].botCategory;
            cardDiv.appendChild(h5);
            cardDiv.appendChild(p1);
            cardDiv.appendChild(p2);
            cardDiv.appendChild(p3);
            cardDiv.appendChild(p4);


            let form  = document.createElement('div');
                form.className = 'mt-4';
                let integrateButton = document.createElement('button');
                integrateButton.className  = 'btn btn-primary btn-sm';
                integrateButton.setAttribute('data-toggle', 'modal');
                integrateButton.setAttribute('data-target', '#exampleModal');
                integrateButton.setAttribute('type', 'button');
                integrateButton.innerText = 'Integrate';
                let trainButton = document.createElement('button');
                trainButton.className = 'btn btn-primary btn-sm';
                trainButton.setAttribute('data-toggle', 'modal');
                trainButton.setAttribute('data-target', '#train');
                trainButton.innerText = 'Ask to Train';
                trainButton.setAttribute('type','button');
                cardDiv.appendChild(integrateButton);
                cardDiv.appendChild(trainButton);

            if(data.data.allBots[i].botPlatform === 'Website') {
                let getButton = document.createElement('button');
                getButton.className  = 'btn btn-primary btn-sm';
                getButton.setAttribute('data-toggle', 'modal');
                getButton.setAttribute('data-target', '#staticBackdrop');
                getButton.setAttribute('type', 'button');
                getButton.innerText = 'GetCode';
                getButton.addEventListener('click', function () {
                    let javascript = document.getElementById('jsFile');
                    let bootstrap = document.getElementById('bootstrapFile');
                    let iframe = document.getElementById('iframeCode');

                    bootstrap.innerText = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>';
                    javascript.innerText = '<script src="https://www.significantbots.com/assets/javascript/chatbotFile.js" type="text/javascript"></script>';
                    iframe.innerText = '<div class="chat-container py-2 shadow m-3" id="chat-container" data-company-id='+data.data.company_id+' data-project-id='+data.data.allBots[i].projectId+' style="display: none;">\n' +
                        '    <iframe src="https://www.significantbots.com/bot?Cid='+data.data.company_id+'&Pid='+data.data.allBots[i].projectId+'" height="660" width="390" frameBorder="0"'+'></iframe>\n' +
                        '</div>';
                   // iframe.innerText = '<iframe src="https://significantbots.com/bot?Cid='+data.data.company_id+'&Pid='+data.data.allBots[i].projectId+'" height="660" width="390" frameBorder="0"'+'></iframe>'
                });
                cardDiv.appendChild(getButton);

            }


                contentDiv.appendChild(cardDiv);
                div1.appendChild(contentDiv);
                div.appendChild(div1);
                chatbots.appendChild(div);

        //    }
        }

        let arr = document.getElementsByClassName('platform');
        for(let i=0;i<arr.length;i++){
            console.log('helllo',arr[i].innerText.split(' ')[1]);
            let platform = arr[i].innerText.split(' ')[1];
            if(platform === 'Website'){
                let div1  = document.getElementsByClassName('no-gutters')[i];
                integrateImg(images.website, div1);
            }else if(platform === 'Whatsapp'){
                let div1  = document.getElementsByClassName('no-gutters')[i];
                integrateImg(images.whatsapp, div1);
            }else if(platform === 'slack'){
                let div1  = document.getElementsByClassName('no-gutters')[i];
                integrateImg(images.slack, div1);
            }else if(platform === 'telegram'){
                let div1  = document.getElementsByClassName('no-gutters')[i];
                integrateImg(images.telegram, div1);
            }
        }

    });


    document.getElementById('send').addEventListener('click', function () {
        console.log('Send button is clicked');
    });

    $('#exampleFormControlSelect2').on('change', function () {
        if(this.value == 'Whatsapp'){

            $('#number').css('visibility', 'visible');
        }else{
            $('#number').css('visibility', 'hidden');
        }
    })



function integrateImg(imageUrl, div1) {

    let imgDiv = document.createElement('div');
    imgDiv.className = 'col-md-4 imageDiv';
    let img = document.createElement('img');
    img.className = 'card-img';
    img.setAttribute('src',imageUrl);
    imgDiv.appendChild(img);
    div1.prepend(imgDiv);
}

});