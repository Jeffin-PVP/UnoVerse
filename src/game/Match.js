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

        this.message = game.message;

        this.channelId = game.channelId;

    }

    start() {

        for (const player of this.players) {

            player.drawMany(
                this.deck,
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

    reverse() {

        this.direction *= -1;

    }

    /**
     * Verifica se uma carta pode ser jogada.
     */
    canPlay(card) {

        // Coringas sempre podem
        if (card.color === "wild")
            return true;

        // Mesma cor
        if (card.color === this.currentColor)
            return true;

        // Mesmo valor
        if (card.value === this.currentCard.value)
            return true;

        return false;

    }

    /**
     * Joga uma carta.
     */
    playCard(player, index) {

        const card = player.hand[index];

        if (!card)
            return false;

        if (!this.canPlay(card))
            return false;

        // Remove da mão
        player.hand.splice(index, 1);

        // Atualiza a mesa
        this.currentCard = card;

        this.currentColor = card.color;

        this.discard.push(card);

        // Passa o turno
        this.nextTurn();

        return true;

    }

}

module.exports = Match;