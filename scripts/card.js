class Card {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }

    clone() {
        return new Card(this.value, this.color);
    }
}