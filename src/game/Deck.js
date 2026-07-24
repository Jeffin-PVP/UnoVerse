const Card = require("./Card");

class Deck {

    constructor() {

        this.cards = [];

        this.create();
        this.shuffle();

    }

    create() {

        const colors = [
            "red",
            "blu",
            "grn",
            "yel"
        ];

        for (const color of colors) {

            // Uma carta 0
            this.cards.push(
                new Card(color, "0")
            );

            // Duas cartas de 1 a 9
            for (let i = 1; i <= 9; i++) {

                this.cards.push(new Card(color, `${i}`));
                this.cards.push(new Card(color, `${i}`));

            }

            // Duas cartas de ação
            for (let i = 0; i < 2; i++) {

                this.cards.push(new Card(color, "skip"));
                this.cards.push(new Card(color, "reverse"));
                this.cards.push(new Card(color, "draw2"));

            }

        }

        // 4 Coringas e 4 +4
        for (let i = 0; i < 4; i++) {

            this.cards.push(new Card("wild", "wild"));
            this.cards.push(new Card("wild", "draw4"));

        }

    }

    shuffle() {

        for (let i = this.cards.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [
                this.cards[i],
                this.cards[j]
            ] = [
                this.cards[j],
                this.cards[i]
            ];

        }

    }

    draw() {

        if (!this.cards.length)
            return null;

        return this.cards.pop();

    }

    deal(amount = 7) {

        const hand = [];

        for (let i = 0; i < amount; i++) {

            const card = this.draw();

            if (!card)
                break;

            hand.push(card);

        }

        return hand;

    }

    remaining() {

        return this.cards.length;

    }

    isEmpty() {

        return this.cards.length === 0;

    }

}

module.exports = Deck;