class GuiCard {
    static scaleFactor = 0.43;
    static size = { x: 280 * GuiCard.scaleFactor, y: 440 * GuiCard.scaleFactor };

    constructor(cardProperty) {
        this.value = cardProperty.value;
        this.color = cardProperty.color;
        this.img = cardProperty.img;
        this.position = createVector(0, 0);
    }

    show(canvas) {
        canvas.imageMode(CENTER);
        canvas.image(this.img, this.position.x, this.position.y, GuiCard.size.x, GuiCard.size.y);
    }

    isMouseOver(canvas) {
        if (canvas.mouseX > this.position.x - GuiCard.size.x / 2 && canvas.mouseX < (this.position.x + GuiCard.size.x / 2)) {
            if (canvas.mouseY > this.position.y - GuiCard.size.y / 2 && canvas.mouseY < (this.position.y + GuiCard.size.y / 2)) {
                return true;
            }
        }
        return false;
    }
}

var cardProperties = [];
var cpuCards = [];

function setup() {
    createCanvas(900, 700);

    for (const color of Schnapsen.colors) {
        for (const value of Schnapsen.values) {
            let img = loadImage("assets/cards/" + color + "/" + value + ".png");
            cardProperties.push({
                color: color,
                value: value,
                img: img
            });
        }
    }
}

var canvas1 = function(p) {
    let deck = [];

    p.setup = function() {
        p.createCanvas(1600, 650);
        for (let i = 0; i < Schnapsen.deckSize; i++) deck[i] = new GuiCard(cardProperties[i]);
        for (let i = 0; i < deck.length; i++) {
            let posX = 10 + ((i % 12) * (GuiCard.size.x + 10)) + GuiCard.size.x / 2;
            let posY = 10 + (Math.floor(i / 12) * (GuiCard.size.y + 10)) + GuiCard.size.y / 2
            deck[i].position = createVector(posX, posY);
        }
    }

    p.draw = function() {
        p.background(255);
        p.fill(4, 70, 109);
        p.noStroke();
        p.rect(0, 0, p.width, p.height, 20, 20);

        for (let i = 0; i < deck.length; i++) {
            if (deck[i] == null) continue;
            deck[i].show(p);
        }

        p.stroke(0);
        p.strokeWeight(3);
        for (let i = 0; i < 8; i++) {
            p.rect(10 + (i * (GuiCard.size.x + 10)) + 5, 40 + 2 * (GuiCard.size.y + 10) + 5, GuiCard.size.x - 10, GuiCard.size.y - 10, 5, 5);
        }

        for (let i = 0; i < cpuCards.length; i++) cpuCards[i].show(p);
    }

    p.mousePressed = function() {
        if (p.mouseX <= p.width && p.mouseX >= 0 && p.mouseY <= p.height && p.mouseY >= 0) {
            if (cpuCards.length == 8) return;

            for (let i = 0; i < deck.length; i++) {
                if (deck[i] == null) continue;

                if (deck[i].isMouseOver(p)) {
                    let card = deck[i];
                    let posX = 10 + (cpuCards.length * (GuiCard.size.x + 10)) + GuiCard.size.x / 2;
                    let posY = 40 + 2 * (GuiCard.size.y + 10) + GuiCard.size.y / 2
                    card.position = createVector(posX, posY);

                    cpuCards.push(card);
                    deck[i] = null;
                    break;
                }
            }
        }
    }
}

new p5(canvas1, "canvas1");