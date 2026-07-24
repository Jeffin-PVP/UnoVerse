class ApplicationEmojiManager {

    static cache = new Map();

    static async load(client) {

        const emojis =
            await client.application.emojis.fetch();

        this.cache.clear();

        for (const emoji of emojis.values()) {

            this.cache.set(
                emoji.name,
                emoji
            );

        }

        console.log(
            `✅ ${this.cache.size} emojis da aplicação carregados.`
        );

    }

    /**
     * Retorna o objeto do emoji.
     */
    static getEmoji(name) {

        return this.cache.get(name);

    }

    /**
     * Retorna o emoji como string (<:nome:id>).
     */
    static get(name) {

        const emoji =
            this.cache.get(name);

        return emoji
            ? emoji.toString()
            : `:${name}:`;

    }

}

module.exports = ApplicationEmojiManager;