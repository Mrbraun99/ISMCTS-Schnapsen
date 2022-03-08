class Game {
    constructor(cpuCards, playerCount, firstPlayerID, trumpSuit) {
        this.playerCount = playerCount;
        this.placedCards = new CardSet();
        this.trumpSuit = trumpSuit;
        this.moveHistory = [];

        this.players = [];
        for (let i = 0; i < this.playerCount; i++) {
            this.players[i] = { id: i, teamCpu: false, score: 0, wins: 0, possibleCards: null, fixedCards: null, cardCount: 8 };
        }

        this.players[0].teamCpu = true;
        this.players[0].possibleCards = new CardSet();
        this.players[0].fixedCards = new CardSet().appendAll(cpuCards);

        for (let i = 1; i < this.playerCount; i++) {
            this.players[i].teamCpu = (firstPlayerID != i && firstPlayerID != 0);
            this.players[i].possibleCards = new CardSet().appendAll(Schnapsen.getDeck()).removeAll(cpuCards);
            this.players[i].fixedCards = new CardSet();
        }

        this.order = [];
        for (let i = 0; i < this.playerCount; i++) this.order[i] = (firstPlayerID + i) % this.playerCount;     
    }

    getNextPlayerID() {
        return 0;
    }

    applyMove(move) {
        throw "This move is illegal!";
    }

    getPlayerScore(playerID) {
        return 0;
    }
}