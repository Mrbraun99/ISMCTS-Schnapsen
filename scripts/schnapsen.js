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
}