class MatchManager {

    static matches = new Map();

    static create(match) {

        this.matches.set(
            match.message.id,
            match
        );

    }

    static get(messageId) {

        return this.matches.get(messageId);

    }

    static delete(messageId) {

        this.matches.delete(messageId);

    }

}

module.exports = MatchManager;