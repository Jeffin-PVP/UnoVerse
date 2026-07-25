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

    /**
     * Avança o turno uma quantidade de jogadores.
     */
    advanceTurn(steps = 1) {

        for (let i = 0; i < steps; i++) {

            this.nextTurn();

        }

    }

    reverse() {

        this.direction *= -1;

    }

    /**
     * Pula o próximo jogador.
     */
    skip() {

        this.advanceTurn(2);

    }

    /**
     * Coloca uma carta normal na mesa.
     */
    placeCard(card) {

        this.currentCard = card;

        this.currentColor = card.color;

        this.discard.push(card);

    }

    /**
     * Coloca um coringa na mesa.
     * A cor será escolhida depois.
     */
    placeWild(card) {

        this.currentCard = card;

        this.discard.push(card);

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

        // Mesmo número ou ação
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

        switch (card.value) {

            case "reverse": {

                this.placeCard(card);

                // Em partidas de 2 jogadores,
                // Reverse funciona como Skip
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

                // Próximo jogador
                this.advanceTurn();

                const target =
                    this.getCurrentPlayer();

                // Compra duas cartas
                target.drawMany(
                    this.deck,
                    2
                );

                // Perde o turno
                this.advanceTurn();

                return true;

            }

            case "wild": {

                this.placeWild(card);

                this.pendingWild = true;

                this.pendingWildPlayer = player.id;

                return "choose_color";

            }

            case "draw4": {

                this.placeWild(card);

                this.pendingWild = true;

                this.pendingWildPlayer = player.id;

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