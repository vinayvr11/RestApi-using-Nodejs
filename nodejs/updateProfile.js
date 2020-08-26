const userData = require('../DB/SignupDb');
const passwordAuthOps = require('../nodejs/passwordAuthOps');


exports.update =   async function updateProf(req, res) {
    let find = {company_id: req.body.company_id};
    let update = [];

    if (req.body.name) {
        update.push({name: req.body.name});
    }
    if (req.body.last) {
        update.push({last: req.body.last});

    }
    if (req.body.phone) {
        update.push({phone: req.body.phone});
    }
    if (req.body.company_name) {
        update.push({company_name: req.body.company_name});
    }
    if (req.body.company_url) {
        update.push({company_url: req.body.company_url});
    }
    if (req.body.address) {
        update.push({address: req.body.address});
    }
  
    var i = 0;
    for (i; i < update.length; i++) {
        await userData.findOneAndUpdate(find, update[i], (err, user) => {
            if (err) {
                console.log("There was some error in updating the data");

            } else {
                console.log("Data updated succesfully");
            }
        });
    }


    const data = await userData.findOne(find);
    await res.json({
        'message': 'Profile has been updated',
        'userData': data
    });
}


