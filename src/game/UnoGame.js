const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const Player = require("./Player");
const EmbedManager = require("./EmbedManager");

class UnoGame {

    constructor(hostUser, maxPlayers, initialCards) {

        this.host = hostUser.id;

        this.maxPlayers = maxPlayers;
        this.initialCards = initialCards;

        this.players = [
            new Player(hostUser)
        ];

        this.message = null;
        this.channelId = null;

    }

    isFull() {

        return this.players.length >= this.maxPlayers;

    }

    hasPlayer(userId) {

        return this.players.some(
            player => player.id === userId
        );

    }

    addPlayer(user) {

        if (this.hasPlayer(user.id))
            return false;

        if (this.isFull())
            return false;

        this.players.push(
            new Player(user)
        );

        return true;

    }

    removePlayer(userId) {

        if (userId === this.host)
            return false;

        this.players = this.players.filter(
            player => player.id !== userId
        );

        return true;

    }

    createEmbed() {

        return EmbedManager.lobby(this);

    }

    createButtons() {

        const full = this.isFull();

        return [

            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId("uno_join")

                        .setLabel("Entrar")

                        .setEmoji("➕")

                        .setStyle(ButtonStyle.Success)

                        .setDisabled(full),

                    new ButtonBuilder()

                        .setCustomId("uno_leave")

                        .setLabel("Sair")

                        .setEmoji("➖")

                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()

                        .setCustomId("uno_start")

                        .setLabel("Iniciar")

                        .setEmoji("▶️")

                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()

                        .setCustomId("uno_delete")

                        .setLabel("Excluir")

                        .setEmoji("🗑️")

                        .setStyle(ButtonStyle.Danger)

                )

        ];

    }

}

module.exports = UnoGame;