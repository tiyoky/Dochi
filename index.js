const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
const ownerID = '1018206885704372274';

client.on('messageCreate', message => {
    if (!message.content.startsWith('+') || message.author.bot) return;

    const args = message.content.slice('+'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'setticket') {
        if (message.author.id !== ownerID) {
            return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
        }

        const category = message.guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === 'Tickets');
        if (!category) {
            message.guild.channels.create('Tickets', { type: 'GUILD_CATEGORY' })
                .then(category => {
                    message.guild.channels.create('ticket-1', { type: 'GUILD_TEXT', parent: category.id })
                        .then(ticketChannel => {
                            ticketChannel.send("Ce salon est un salon de tickets. Utilisez la réaction 🎟️ pour créer un nouveau ticket.");
                            ticketChannel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false });
                        });
                });
        } else {
            message.guild.channels.create(`ticket-${category.children.size + 1}`, { type: 'GUILD_TEXT', parent: category.id })
                .then(ticketChannel => {
                    ticketChannel.send("Ce salon est un salon de tickets. Utilisez la réaction 🎟️ pour créer un nouveau ticket.");
                    ticketChannel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false });
                });
        }
    }
});

client.login('process.env.TOKEN');
