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
        return this.order[0];
    }

    getPlayerScore(playerID) {
        if (playerID >= this.playerCount) return 0;
        return this.players[playerID].score;
    }

    isCpuNext() {
        return this.order[0] == 0;
    }

    applyMove(move) {       
        let activePlayer = this.players[this.getNextPlayerID()];
        if (!activePlayer.fixedCards.contains(move.card) && !activePlayer.possibleCards.contains(move.card)) throw "This move is illegal!";

        activePlayer.cardCount--;
        activePlayer.fixedCards.remove(move.card);
        for (let i = 0; i < this.playerCount; i++) this.players[i].possibleCards.remove(move.card);

        if (move.isSpecial) {
            activePlayer.score += (move.card.color == this.trumpSuit) ? 40 : 20;
            activePlayer.fixedCards.append((move.card.value == Schnapsen.III) ? new Card(Schnapsen.IV, move.card.color) : new Card(Schnapsen.III, move.card.color));
        }

        activePlayer.possibleCards.removeAll(Schnapsen.getCantHoldCards(this.placedCards, move.card, this.trumpSuit));
        this.reEvaulatePlayers();

        this.placedCards.append(move.card);
        this.moveHistory.push({ playerID: this.getNextPlayerID() });
        this.order.shift();

        if (this.placedCards.length == this.playerCount) {
            let winnerID = this.moveHistory[Schnapsen.getWinner(this.placedCards, this.trumpSuit)].playerID;

            this.players[winnerID].score += this.placedCards.map((card) => card.value).reduce((pSum, a) => pSum + a, 0);
            this.players[winnerID].wins += 1;
            for (let i = 0; i < this.playerCount; i++) this.order[i] = (winnerID + i) % this.playerCount;

            this.placedCards = new CardSet();
            this.moveHistory = [];
        }
    }

    reEvaulatePlayers() {
        while (true) {
            let checkAgain = false;

            let fixedCards = new CardSet();
            for (const player of this.players) fixedCards.appendAll(player.fixedCards);
            for (const player of this.players) player.possibleCards.removeAll(fixedCards);

            for (let player of this.players) {
                if (player.possibleCards.length == 0) continue;

                if (player.possibleCards.length + player.fixedCards.length == player.cardCount) {
                    player.fixedCards.appendAll(player.possibleCards);
                    checkAgain = true;
                }
            }

            if (this.players.length == 3) {
                for (const card of Schnapsen.getDeck()) {
                    let cardCount = 0;
                    let holderID = null;

                    for (let i = 0; i < 3; i++) {
                        if (this.players[0].possibleCards.contains(card)) {
                            holderID = i;
                            cardCount++;
                        }
                    }

                    if (cardCount == 1) {
                        this.players[holderID].fixedCards.append(card);
                        checkAgain = true;
                    }
                }
            }

            if (!checkAgain) break;
        }
    }

    determinize() {
        function combineCards(fixedCards, possibleCards, cardCount) {
            let cards = new CardSet();
            cards.appendAll(fixedCards);
            cards.appendAll(possibleCards.getRandom(cardCount - cards.length));
            return cards;
        }

        let detPlayers = [];
        for (const player of this.players) {
            let cards = combineCards(player.fixedCards, player.possibleCards, player.cardCount);
            detPlayers.push({ id: player.id, teamCpu: player.teamCpu, score: player.score, wins: player.wins, cards: cards });
        }

        let moveHistoryClone = [];
        for (let i = 0; i < this.moveHistory.length;i++) moveHistoryClone[i] = {playerID : this.moveHistory[i].playerID};

        return new DetGameState(detPlayers, moveHistoryClone, new CardSet().appendAll(this.placedCards), this.playerCount, this.getNextPlayerID(), this.trumpSuit);
    }
}