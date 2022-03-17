class DetGameState {
    constructor(players, moveHistory, placedCards, playerCount, firstPlayerID, trumpSuit) {
        this.players = players;
        this.moveHistory = moveHistory;
        this.placedCards = placedCards;
        this.playerCount = playerCount;
        this.trumpSuit = trumpSuit;

        this.resultFromCpuPerspective = null;

        this.order = [];
        for (let i = 0; i < this.playerCount; i++) this.order[i] = (firstPlayerID + i) % this.playerCount;
    }

    getNextPlayerID() {
        return this.order[0];
    }

    getResultFromCpuPerspective() {
        return this.resultFromCpuPerspective;
    }

    calculateResultFromCpuPerspective(winnerID) {
        let multiplier = (this.players[winnerID].teamCpu == true) ? 1 : -1;

        let opponentTeamScore = 0;
        let opponentTeamWins = 0;
        for (const player of this.players) {
            if (player.teamCpu != this.players[winnerID].teamCpu) {
                opponentTeamScore += player.score;
                opponentTeamWins += player.wins;
            }
        }

        let result = 6;
        if (opponentTeamWins > 0) result -= 2;
        if (opponentTeamScore >= 33) result -= 2;
        return result * multiplier;
    }

    applyMove(move) {
        function getExtraPoints(cards, trumpSuit) {
            if (cards.contains(new Card(Schnapsen.III, trumpSuit)) && cards.contains(new Card(Schnapsen.IV, trumpSuit))) return 40;

            for (const color of colors) {
                if (color == trumpSuit) continue;
                if (cards.contains(new Card(Schnapsen.III, color)) && cards.contains(new Card(Schnapsen.IV, color))) return 40;
            }
        }

        let activePlayer = this.players[this.getNextPlayerID()];
        activePlayer.cards.remove(move.card);
        if (move.isSpecial) activePlayer.score += (move.card.color == this.trumpSuit) ? 40 : 20;

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

            if (this.players[0].cards.length == 0) this.resultFromCpuPerspective = this.calculateResultFromCpuPerspective(winnerID);
            else {
                let winnerTeamScore = 0;
                let winnerTeamWins = 0;

                for (const player of this.players) {
                    if (player.teamCpu == this.players[winnerID].teamCpu) {
                        winnerTeamScore += player.score;
                        winnerTeamWins += player.wins;
                    }
                }

                winnerTeamScore += getExtraPoints(this.players[winnerID].cards, this.trumpSuit);

                if (winnerTeamWins > 0 && winnerTeamScore >= 66) this.resultFromCpuPerspective = this.calculateResultFromCpuPerspective(winnerID);
            }
        }
    }

    getPossibleMoves() {
        let moves = [];
        let nextPlayerID = this.getNextPlayerID();
        let canPlaceCards = Schnapsen.getCanPlaceCards(this.placedCards, this.players[nextPlayerID].cards, this.trumpSuit);

        for (const card of canPlaceCards) {
            let isSpecial = false;
            if (this.placedCards.length == 0 && card.value == Schnapsen.III && this.players[nextPlayerID].cards.contains(new Card(Schnapsen.IV, card.color))) isSpecial = true;
            if (this.placedCards.length == 0 && card.value == Schnapsen.IV && this.players[nextPlayerID].cards.contains(new Card(Schnapsen.III, card.color))) isSpecial = true;

            moves.push({ playerID: nextPlayerID, teamCpu: this.players[nextPlayerID].teamCpu, card: card, isSpecial: isSpecial });
        }

        return moves;
    }
}