class Card {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }

    clone() {
        return new Card(this.value, this.color);
    }
}

CardSet.prototype = Array.prototype;

function CardSet() {
    this.contains = function(card) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].value == card.value && this[i].color == card.color) return true;
        }
        return false;
    }

    this.containsAll = function(cards) {
        for (const card of cards) {
            if (!this.contains(card)) return false;
        }

        return true;
    }

    this.containsWithColor = function(color) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].color == color) return true;
        }
        return false;
    }

    this.getBiggerCards = function(card) {
        let cards = new CardSet();
        for (let i = 0; i < this.length; i++) {
            if (this[i].value > card.value && this[i].color == card.color) cards.append(this[i]);
        }

        return cards;
    }

    this.getSmallerCards = function(card) {
        let cards = new CardSet();
        for (let i = 0; i < this.length; i++) {
            if (this[i].value < card.value && this[i].color == card.color) cards.append(this[i]);
        }

        return cards;
    }

    this.getCardsWithColor = function(color) {
        let cards = new CardSet();
        for (let i = 0; i < this.length; i++) {
            if (this[i].color == color) cards.append(this[i]);
        }

        return cards;
    }

    this.append = function(card) {
        if (this.contains(card)) return;
        this.push(card);
        return this;
    }

    this.appendAll = function(cards) {
        for (const card of cards) this.append(card);
        return this;
    }

    this.remove = function(card) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].value == card.value && this[i].color == card.color) {
                this.splice(i, 1);
                break;
            }
        }

        return this;
    }

    this.removeAll = function(cards) {
        for (const card of cards) this.remove(card);
        return this;
    }

    this.getRandom = function(count) {
        return new CardSet().appendAll(shuffle(this, false).slice(0, Math.min(count, this.length)));
    }

    this.clone = function() {
        let cards = new CardSet();
        for (let i = 0; i < this.length; i++) cards.append(this[i].clone());
        return cards;
    }
}