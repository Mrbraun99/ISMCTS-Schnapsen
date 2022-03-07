class Schnapsen {
    static IX = 0;
    static II = 2;
    static III = 3;
    static IV = 4;
    static X = 10;
    static A = 11;

    static hearts = 0;
    static bells = 1;
    static acorns = 2;
    static leaves = 3;

    static values = [Schnapsen.IX, Schnapsen.II, Schnapsen.III, Schnapsen.IV, Schnapsen.X, Schnapsen.A];
    static colors = [Schnapsen.hearts, Schnapsen.bells, Schnapsen.acorns, Schnapsen.leaves];

    static deckSize = Schnapsen.values.length * Schnapsen.colors.length;

    static getDeck() {
        let deck = [];
        for (let i = 0; i < Schnapsen.values.length; i++) {
            for (let j = 0; j < Schnapsen.colors.length; j++) {
                deck.push(new Card(Schnapsen.values[i], Schnapsen.colors[j]));
            }
        }
        return deck;
    }

    static getCantHoldCards(placedCards, placedCard, trumpSuit) {
        function getPivotCard(color) {
            for (let i = placedCards.length - 1; i >= 0; i--) {
                if (placedCards[i].color == color) return placedCards[i];
            }

            return null;
        }

        let cantHoldCards = new CardSet();

        if (placedCards.length == 0) return cantHoldCards;

        if (placedCard.color != placedCards[0].color && placedCard.color != trumpSuit) {
            for (const value of Schnapsen.values) cantHoldCards.append(new Card(value, placedCards[0].color));
            for (const value of Schnapsen.values) cantHoldCards.append(new Card(value, trumpSuit));
            return cantHoldCards;
        }

        if (placedCard.color == placedCards[0].color) {
            let pivotCard = getPivotCard(placedCards[0].color);

            if (placedCard.value < pivotCard.value) {
                for (const value of Schnapsen.values) {
                    if (value > pivotCard.value) cantHoldCards.append(new Card(value, placedCard.color));
                }
            }

            return cantHoldCards;
        }

        if (placedCard.color == trumpSuit) {
            for (const value of Schnapsen.values) cantHoldCards.append(new Card(value, placedCards[0].color));

            let pivotCard = getPivotCard(trumpSuit);
            if (pivotCard != null) {
                if (placedCard.value < pivotCard.value) {
                    for (const value of Schnapsen.values) {
                        if (value > pivotCard.value) cantHoldCards.append(new Card(value, placedCard.color));
                    }
                }
            }

            return cantHoldCards;
        }
    }
}