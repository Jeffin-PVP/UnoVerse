class Player {

    constructor(user) {

        this.id = user.id;
        this.username = user.username;
        this.displayName = user.displayName ?? user.username;

        // Mão do jogador
        this.hand = [];

        // Estado do jogador
        this.saidUno = false;
        this.isBot = user.bot ?? false;

    }

    /**
     * Compra uma carta do baralho.
     * @param {Deck} deck
     * @returns {Card|null}
     */
    draw(deck) {

        const card = deck.draw();

        if (!card)
            return null;

        this.hand.push(card);

        return card;

    }

    /**
     * Compra várias cartas.
     * @param {Deck} deck
     * @param {number} amount
     */
    drawMany(deck, amount) {

        for (let i = 0; i < amount; i++) {

            const card = deck.draw();

            if (!card)
                break;

            this.hand.push(card);

        }

    }

    /**
     * Remove uma carta da mão.
     * @param {number} index
     * @returns {Card|null}
     */
    play(index) {

        if (
            index < 0 ||
            index >= this.hand.length
        ) return null;

        this.saidUno = false;

        return this.hand.splice(index, 1)[0];

    }

    /**
     * Adiciona uma carta diretamente.
     */
    addCard(card) {

        this.hand.push(card);

    }

    /**
     * Quantidade de cartas.
     */
    cardCount() {

        return this.hand.length;

    }

    /**
     * Está sem cartas?
     */
    hasWon() {

        return this.hand.length === 0;

    }

    /**
     * Está com uma carta?
     */
    hasUno() {

        return this.hand.length === 1;

    }

    /**
     * Falou UNO corretamente?
     */
    sayUno() {

        if (this.hasUno()) {

            this.saidUno = true;
            return true;

        }

        return false;

    }

    /**
     * Recebe penalidade por esquecer o UNO.
     */
    forgotUno(deck) {

        if (this.hasUno() && !this.saidUno) {

            this.drawMany(deck, 2);

            return true;

        }

        return false;

    }

    /**
     * Verifica se possui alguma carta jogável.
     */
    hasPlayableCard(currentCard, currentColor) {

        return this.hand.some(card => {

            if (card.color === "wild")
                return true;

            return (
                card.color === currentColor ||
                card.value === currentCard.value
            );

        });

    }

}

module.exports = Player;