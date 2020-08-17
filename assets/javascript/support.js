document.addEventListener('DOMContentLoaded', function () {


    document.getElementById('support').addEventListener('click', async function () {
        let dd = document.getElementsByClassName('dropdown-item')[0];
        if (dd == null) {
            await fetch('/botData').then(result => {
                return result.json();
            }).then(data => {
                if (data) {
                    let dropdown = $('.dropdown-menu');
                    let i = 1;

                    for (i = 1; i <= data.totalBots; i++) {
                        let a = document.createElement('a');
                        if (data.botTrained < i) {
                            a.setAttribute('value', 'trained');
                        }
                        a.className = 'dropdown-item';
                        a.innerText = i.toString();
                        a.addEventListener('click', function () {
                            console.log(this.innerText);
                            let num = this.innerText;
                            document.getElementById('num-bots').setAttribute('value', num);
                            if (this.getAttribute('value') === 'trained') {
                                window.alert('You cannot select more bots because you have already trained some.');
                            } else {

                                let main = document.getElementById('main-row');
                                main.innerHTML = '';
                                let i = 0;
                                let j = 0;
                                let dict = ['Name', 'Category', 'Platform'];
                                let inputs = [];
                                let d = null;
                                let len = parseInt(this.innerText);
                                for (i = 0; i < len; i++) {
                                    d = document.createElement('div');
                                    d.className = "row name-category";
                                    for (j = 0; j < 3; j++) {
                                        let innerD = document.createElement('div');
                                        let input = document.createElement('input');
                                        innerD.className = "col";
                                        input.className = "form-control " + dict[j];
                                        input.setAttribute('name', dict[j]);
                                        input.required = true;
                                        input.setAttribute('type', 'text');
                                        input.setAttribute('placeholder', dict[j]);
                                        innerD.appendChild(input);
                                        d.appendChild(innerD);
                                    }
                                    main.appendChild(d);
                                }
                            }

                        });
                        dropdown.append(a);
                    }

                }
            })
        }
    });



   /* let submit_button = document.querySelector('#submit-details');
    submit_button.addEventListener('click', function () {
        let file = document.querySelector('#inputGroupFile04');
        let name = document.getElementsByClassName('Name');
        let category = document.getElementsByClassName('Category');
        let platform = document.getElementsByClassName('Platform');

        console.log('details send');
        fetch('/postAdmin', {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                file: file,
                name: name,
                category: category,
                platform: platform
            })
        })

    });*/



});

