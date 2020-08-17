const botInfo = require('../DB/intents');


class BotOps{
    static async getNoOfBots(req, res){
        let user = await botInfo.findOne({company_id: req.params.company_id});
        let length = user.allBots.length;
        let total = 0;
        let i=0;
        for(i=0; i<length;i++){
            if(!user.allBots[i].isTrained && user.allBots[i].status == 'untrained' ){
                total += 1;
            }
        }


        return {totalBots: length,
                botsTrained:total};
    }
}


exports.ourBot = (req, res) => {
    res.render('chatbot');
}
exports.getUserBot = (req, res) => {
    res.render('userBot', {cid:req.query.Cid,
                        pid: req.query.Pid});
}

//module.exports = {botOps: BotOps};
