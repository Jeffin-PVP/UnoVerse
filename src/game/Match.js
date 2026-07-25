const Deck = require("./Deck");

class Match {

    constructor(game) {

        this.host = game.host;

        this.players = game.players;

        this.cardsPerPlayer = game.initialCards;

        this.deck = new Deck();

        this.discard = [];

        this.currentPlayer = 0;

        this.direction = 1;

        this.currentColor = null;

        this.currentCard = null;

        // Aguarda escolha de cor do coringa
        this.pendingWild = false;
        this.pendingWildPlayer = null;
        this.pendingWildType = null;

        this.message = game.message;

        this.channelId = game.channelId;

    }

    start() {

        for (const player of this.players) {

            this.drawCards(
                player,
                this.cardsPerPlayer
            );

        }

        let firstCard;

        do {

            firstCard = this.deck.draw();

        } while (firstCard.color === "wild");

        this.currentCard = firstCard;

        this.currentColor = firstCard.color;

        this.discard.push(firstCard);

    }

    getCurrentPlayer() {

        return this.players[
            this.currentPlayer
        ];

    }

    nextTurn() {

        this.currentPlayer += this.direction;

        if (this.currentPlayer >= this.players.length)
            this.currentPlayer = 0;

        if (this.currentPlayer < 0)
            this.currentPlayer = this.players.length - 1;

    }

    /**
     * Avança o turno.
     */
    advanceTurn(steps = 1) {

        for (let i = 0; i < steps; i++) {

            this.nextTurn();

        }

    }

    reverse() {

        this.direction *= -1;

    }

    skip() {

        this.advanceTurn(2);

    }

    /**
     * Reabastece o baralho usando o descarte.
     */
    refillDeck() {

        // Precisa sobrar a carta da mesa
        if (this.discard.length <= 1)
            return false;

        const topCard = this.discard.pop();

        this.deck.cards = [...this.discard];

        this.discard = [topCard];

        this.deck.shuffle();

        return true;

    }

    /**
     * Compra uma carta.
     */
    drawCard(player) {

        if (this.deck.cards.length === 0) {

            const refilled =
                this.refillDeck();

            if (!refilled)
                return null;

        }

        return player.draw(this.deck);

    }

    /**
     * Compra várias cartas.
     */
    drawCards(player, amount) {

        for (let i = 0; i < amount; i++) {

            if (!this.drawCard(player))
                break;

        }

    }

    placeCard(card) {

        this.currentCard = card;

        this.currentColor = card.color;

        this.discard.push(card);

    }

    placeWild(card) {

        this.currentCard = card;

        this.discard.push(card);

    }

    canPlay(card) {

        if (card.color === "wild")
            return true;

        if (card.color === this.currentColor)
            return true;

        if (card.value === this.currentCard.value)
            return true;

        return false;

    }

    playCard(player, index) {

        const card = player.hand[index];

        if (!card)
            return false;

        if (!this.canPlay(card))
            return false;

        // Remove da mão
        player.hand.splice(index, 1);

        switch (card.value) {

            case "reverse": {

                this.placeCard(card);

                if (this.players.length === 2) {

                    this.skip();

                } else {

                    this.reverse();

                    this.advanceTurn();

                }

                return true;

            }

            case "skip": {

                this.placeCard(card);

                this.skip();

                return true;

            }

            case "draw2": {

                this.placeCard(card);

                this.advanceTurn();

                const target =
                    this.getCurrentPlayer();

                this.drawCards(
                    target,
                    2
                );

                this.advanceTurn();

                return true;

            }

            case "wild": {

                this.placeWild(card);

                this.pendingWild = true;

                this.pendingWildPlayer = player.id;

                this.pendingWildType = "wild";

                return "choose_color";

            }

            case "draw4": {

                this.placeWild(card);

                this.pendingWild = true;

                this.pendingWildPlayer = player.id;

                this.pendingWildType = "draw4";

                return "choose_color_draw4";

            }

        }

        // Carta normal
        this.placeCard(card);

        this.advanceTurn();

        return true;

    }

}

module.exports = Match;