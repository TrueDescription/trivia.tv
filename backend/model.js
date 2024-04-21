module.exports = class Game {
	constructor(){
		this.currentQuestion={};
        this.timer = 30;
        this.players = [];
        this.playerCount = 0;
        this.resetQuestion('test');
    }

    setQuestion(question) {
        this.currentQuestion=question;
    }

    addPlayer(ws) {
        this.players.push([ws]);
        this.players++;
    }
}