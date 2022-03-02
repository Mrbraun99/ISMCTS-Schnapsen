class GuiCard {
    static scaleFactor = 0.43;
    static size = { x: 280 * GuiCard.scaleFactor, y: 440 * GuiCard.scaleFactor };

    constructor(cardProperty) {
        this.value = cardProperty.value;
        this.color = cardProperty.color;
        this.img = cardProperty.img;
        this.position = createVector(0, 0);
        this.highlight = false;
    }

    show(canvas) {
        canvas.imageMode(CENTER);
        let scale = (this.highlight) ? 1.3 : 1;
        canvas.image(this.img, this.position.x, this.position.y, GuiCard.size.x * scale, GuiCard.size.y * scale);
    }

    isMouseOver(canvas) {
        if (canvas.mouseX > this.position.x - GuiCard.size.x / 2 && canvas.mouseX < (this.position.x + GuiCard.size.x / 2)) {
            if (canvas.mouseY > this.position.y - GuiCard.size.y / 2 && canvas.mouseY < (this.position.y + GuiCard.size.y / 2)) {
                return true;
            }
        }
        return false;
    }

    changeHighlight() {
        this.highlight = !this.highlight;
    }

    setHighlight(value) {
        this.highlight = value;
    }

    isHighlighted() {
        return this.highlight;
    }
}

//-------------------------------------------------------------------------------------------------------------

function getPlayerName(index) {
    let name = getItem("player_" + index + "_name")
    return (name == "") ? "Player " + index : name;
}

//-------------------------------------------------------------------------------------------------------------

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

    for (let i = 1; i <= 3; i++) {
        if (getItem("player_" + i + "_name") == null) storeItem("player_" + i + "_name", "");

        document.getElementById("player_" + i + "_name").value = getItem("player_" + i + "_name");
        document.getElementById("player_" + i + "_name_display").innerHTML = getPlayerName(i);

        select("#player_" + i + "_name").input(function() {
            storeItem("player_" + i + "_name", document.getElementById("player_" + i + "_name").value);
            document.getElementById("player_" + i + "_name_display").innerHTML = getPlayerName(i);
        });
    }

    select("#player_count_2").changed(() => {
        document.getElementById("starting_player_1").checked = true;
        document.getElementById("starting_player_3").style.display = "none";
        document.getElementById("player_3_name").style.display = "none";
        document.getElementById("player_3_score_part").style.display = "none";

    });

    select("#player_count_3").changed(() => {
        document.getElementById("starting_player_3").style.display = "inline-block";
        document.getElementById("player_3_name").style.display = "inline-block";
        document.getElementById("player_3_score_part").style.display = "block";
    });
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

var canvas2 = function(p) {
    let deck = [];
    let selectedCard = null;

    p.setup = function() {
        p.createCanvas(1650, 450);
        for (let i = 0; i < Schnapsen.deckSize; i++) deck[i] = new GuiCard(cardProperties[i]);
        for (let i = 0; i < deck.length; i++) {
            let posX = 30 + ((i % 12) * (GuiCard.size.x + 10)) + GuiCard.size.x / 2;
            let posY = 30 + (Math.floor(i / 12) * (GuiCard.size.y + 10)) + GuiCard.size.y / 2
            deck[i].position = createVector(posX, posY);
        }
    }

    p.draw = function() {
        p.background(255);
        p.fill(4, 70, 109);
        p.noStroke();
        p.rect(0, 0, p.width, p.height, 20, 20);

        let highlightedCardIndex = -1;
        for (let i = 0; i < deck.length; i++) {
            if (deck[i] == null) continue;
            if (deck[i].isHighlighted()) highlightedCardIndex = i;
            deck[i].show(p);
        }

        if (highlightedCardIndex != -1) deck[highlightedCardIndex].show(p);
    }

    p.mousePressed = function() {
        if (p.mouseX <= p.width && p.mouseX >= 0 && p.mouseY <= p.height && p.mouseY >= 0) {
            for (let i = 0; i < deck.length; i++) {
                if (deck[i] == null) continue;

                if (deck[i].isMouseOver(p)) {
                    for (let j = 0; j < deck.length; j++) {
                        if (deck[j] == null) continue;
                        if (i != j) deck[j].setHighlight(false);
                    }

                    deck[i].changeHighlight();
                    selectedCard = deck[i].isHighlighted() ? { card: deck[i], index: i } : null;
                }
            }
        }
    }
}

new p5(canvas1, "canvas1");
new p5(canvas2, "canvas2");