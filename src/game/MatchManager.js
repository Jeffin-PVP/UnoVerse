class MatchManager {

    static matches = new Map();

    /**
     * Registra uma partida.
     */
    static create(match) {

        this.matches.set(
            match.channelId,
            match
        );

    }

    /**
     * Obtém a partida do canal.
     */
    static get(channelId) {

        return this.matches.get(channelId);

    }

    /**
     * Remove a partida do canal.
     */
    static delete(channelId) {

        this.matches.delete(channelId);

    }

    /**
     * Verifica se existe uma partida no canal.
     */
    static has(channelId) {

        return this.matches.has(channelId);

    }

    /**
     * Retorna todas as partidas.
     */
    static all() {

        return [...this.matches.values()];

    }

}

module.exports = MatchManager;