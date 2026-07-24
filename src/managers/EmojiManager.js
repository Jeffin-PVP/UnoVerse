const ApplicationEmojiManager =
    require("./ApplicationEmojiManager");

class EmojiManager {

    /**
     * Retorna o emoji como string (<:nome:id>)
     */
    static get(client, name) {

        return ApplicationEmojiManager.get(name);

    }

    /**
     * Retorna o emoji de uma carta.
     */
    static card(client, card) {

        let name;

        if (card.color === "wild") {

            name =
                card.value === "draw4"
                    ? "wild_draw4"
                    : "wild";

        } else {

            name =
                `${card.color}_${card.value}`;

        }

        return this.get(client, name);

    }

    /**
     * Retorna o verso da carta.
     */
    static back(client) {

        return this.get(
            client,
            "card_back"
        );

    }

    /**
     * Retorna o objeto do emoji para Select Menus.
     */
    static cardMenu(client, card) {

        let name;

        if (card.color === "wild") {

            name =
                card.value === "draw4"
                    ? "wild_draw4"
                    : "wild";

        } else {

            name =
                `${card.color}_${card.value}`;

        }

        const emoji =
            ApplicationEmojiManager.getEmoji(name);

        if (!emoji)
            return undefined;

        return {

            id: emoji.id,

            name: emoji.name,

            animated: emoji.animated

        };

    }

}

module.exports = EmojiManager;