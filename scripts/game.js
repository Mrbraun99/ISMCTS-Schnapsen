class Game {
    constructor(cpuCards, playerCount, firstPlayerID, trumpSuit) {

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