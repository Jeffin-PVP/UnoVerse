class Card {

    constructor(color, value) {

        this.color = color;
        this.value = value;

    }

    get emojiName() {

        if (this.color === "wild") {

            return this.value === "draw4"
                ? "wild_draw4"
                : "wild";

        }

        return `${this.color}_${this.value}`;

    }

}

module.exports = Card;