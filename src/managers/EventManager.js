const fs = require("fs");
const path = require("path");

class EventManager {

    static async load(client) {

        const eventsPath = path.join(__dirname, "../events");

        if (!fs.existsSync(eventsPath))
            return;

        const files = fs.readdirSync(eventsPath)
            .filter(file => file.endsWith(".js"));

        for (const file of files) {

            const event = require(path.join(eventsPath, file));

            if (event.once) {

                client.once(
                    event.name,
                    (...args) => event.execute(...args)
                );

            } else {

                client.on(
                    event.name,
                    (...args) => event.execute(...args)
                );

            }

            console.log(`✔ Evento carregado: ${file}`);

        }

    }

}

module.exports = EventManager;