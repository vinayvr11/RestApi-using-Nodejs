document.addEventListener('DOMContentLoaded', function () {

    fetch('/adminData')
        .then(result => result.json())
        .then(data=>{
            let adminBlock = document.getElementsByClassName('admin-block')[0];
            let length = data.data.length;
            for(let i=0;i<length;i++) {
                let div = document.createElement('div');
                let number = document.createElement('div');
                let company_id = document.createElement('div');
                number.className = 'margin';
                if(data.data[i].status === 'train'){
                    div.className = "row train rounded-bottom  list-group-item-action";
                }else{
                    div.className = "row integrate rounded-bottom  list-group-item-action";
                }
                div.setAttribute('data-toggle', 'modal');
                div.setAttribute('data-target', '#modalUpdate');
                company_id.innerText = data.data[i].company_id;
                number.innerText = data.data[i].whatsAppNumber;
                div.innerText = data.data[i].company_id;
                div.addEventListener('mouseover', function () {
                    this.classList.add('shadow');
                });
                div.addEventListener('mouseout', function () {
                    this.classList.remove('shadow');
                });
                div.addEventListener('click', async function(){

                    let table = document.getElementById('tbody');
                    let elements = table.firstChild;
                    while(elements){
                        table.removeChild(elements);
                        elements = table.firstChild;
                    }

                    console.log('clicked',this.innerText);
                    let company_id = this.innerText;
                            let tbody = $('#tbody');

                                let tr = document.createElement('tr');
                                let th = document.createElement('th');
                                let td = document.createElement('td');
                                let td1 = document.createElement('td');
                                let td2 = document.createElement('td');
                                let td3 = document.createElement('td');
                                let td4 = document.createElement('td');
                                th.setAttribute('scope','row');
                                let num = i + 1;
                                th.innerText = num.toString();
                                tr.append(th);
                                td.innerText = data.data[i].botsName;
                                td1.innerText = data.data[i].botsCategory;
                                td2.innerText = data.data[i].botsPlatform;
                                td3.innerText = data.data[i].botsPID;
                                td4.innerText = data.data[i].whatsAppNumber;
                                tr.append(td);
                                tr.append(td1);
                                tr.append(td2);
                                tr.append(td3);
                                tr.append(td4);
                                tbody.append(tr);
                        });
               // });

                adminBlock.appendChild(div);
            }
        });

    let list = document.getElementsByClassName('request-filter');
    let length = list.length;
    for(let i=0;i<length;i++){
        list[i].addEventListener('click', function () {
            let lists = document.getElementsByClassName('request-filter');
            let length = lists.length;
            for(let j=0;j<length;j++){
                lists[j].className = 'list-group-item request-filter';
            }
            this.className += ' active';
            console.log(this.innerText);
            if(this.innerText === 'Train Requests'){
                let train = document.getElementsByClassName('train');
                let integrate  = document.getElementsByClassName('integrate');
                let welcomeMessages = $('#welcome').css('display','unset');
                let whatsappnumber = $('#whatsappnumber').css('display', 'none');
                let whatsapptoken = $('#whatsapptoken').css('display', 'none');
                document.getElementById('check').setAttribute('value','train');
                adminFunc(integrate, train);
            }else if(this.innerText === 'Integration Requests'){
                let integrate  = document.getElementsByClassName('integrate');
                let train  = document.getElementsByClassName('train');
                let whatsappnumber = $('#whatsappnumber').css('display', 'unset');
                let whatsapptoken = $('#whatsapptoken').css('display', 'unset');
                let welcomeMessages = $('#welcome').css('display','none');

                document.getElementById('check').setAttribute('value','integration');

                adminFunc(train, integrate);
            }


        })
    }

    function adminFunc(hideElements, showElements) {
        let hideLength = hideElements.length;
        let showLength = showElements.length;
        for (let i=0;i<hideLength;i++){
            hideElements[i].style.display = 'none';
        }
        for (let i=0;i<showLength;i++){
            showElements[i].style.removeProperty('display');
        }
    }

});

