const GameManager = require("../../game/GameManager");
const MatchManager = require("../../game/MatchManager");
const Match = require("../../game/Match");
const EmbedManager = require("../../game/EmbedManager");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

    const game = GameManager.get(interaction.message.id);

    // Se não for uma sala, deixa outro handler cuidar da interação
    if (!game)
        return;

    switch (interaction.customId) {

        case "uno_join": {

            if (game.hasPlayer(interaction.user.id)) {

                return interaction.reply({
                    content: "❌ Você já está nesta sala.",
                    ephemeral: true
                });

            }

            if (game.isFull()) {

                return interaction.reply({
                    content: "❌ Esta sala está cheia.",
                    ephemeral: true
                });

            }

            game.addPlayer(interaction.user);

            await interaction.update({

                embeds: [
                    game.createEmbed()
                ],

                components: game.createButtons()

            });

            break;

        }

        case "uno_leave": {

            if (!game.hasPlayer(interaction.user.id)) {

                return interaction.reply({
                    content: "❌ Você não está nesta sala.",
                    ephemeral: true
                });

            }

            if (interaction.user.id === game.host) {

                return interaction.reply({
                    content: "❌ O host não pode sair da sala. Exclua a sala ou inicie a partida.",
                    ephemeral: true
                });

            }

            game.removePlayer(interaction.user.id);

            await interaction.update({

                embeds: [
                    game.createEmbed()
                ],

                components: game.createButtons()

            });

            break;

        }

        case "uno_start": {

            if (interaction.user.id !== game.host) {

                return interaction.reply({
                    content: "❌ Apenas o host pode iniciar a partida.",
                    ephemeral: true
                });

            }

            if (game.players.length < 2) {

                return interaction.reply({
                    content: "❌ São necessários pelo menos 2 jogadores.",
                    ephemeral: true
                });

            }

            // Cria a partida
            const match = new Match(game);

            // Salva informações da mensagem e canal
            match.message = interaction.message;
            match.channelId = interaction.channel.id;

            // Distribui as cartas
            match.start();

            // Registra a partida
            MatchManager.create(match);

            // Remove a sala
            GameManager.delete(interaction.message.id);

            // Botões da partida
const row = new ActionRowBuilder()

    .addComponents(

        new ButtonBuilder()

            .setCustomId("game_hand")

            .setLabel("Minha Mão")

            .setEmoji("🎴")

            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()

            .setCustomId("game_play")

            .setLabel("Jogar Carta")

            .setEmoji("🎮")

            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()

            .setCustomId("game_draw")

            .setLabel("Comprar")

            .setEmoji("➕")

            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()

            .setCustomId("game_uno")

            .setLabel("UNO!")

            .setEmoji("📢")

            .setStyle(ButtonStyle.Danger)

    );

            await interaction.update({

                embeds: [
                    EmbedManager.match(
                        interaction.client,
                        match
                    )
                ],

                components: [
                    row
                ]

            });

            break;

        }

        case "uno_delete": {

            if (interaction.user.id !== game.host) {

                return interaction.reply({

                    content: "❌ Apenas o host pode excluir esta sala.",

                    ephemeral: true

                });

            }

            GameManager.delete(interaction.message.id);

            await interaction.message.delete().catch(() => { });

            break;

        }

    }

};