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
        
        createTicketChannel(message);
    }
});

async function createTicketChannel(message) {
    const category = message.guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === 'Tickets');
    if (!category) {
        message.guild.channels.create('Tickets', { type: 'GUILD_CATEGORY' })
            .then(category => createTicket(message, category.id, 1));
    } else {
        createTicket(message, category.id, category.children.size + 1);
    }
}

async function createTicket(message, categoryID, ticketNumber) {
    const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} Support`)
        .setDescription("Cliquez sur le bouton ci-dessous pour créer un ticket et contacter le support du serveur.")
        .setColor("#FF5733");
        
    const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('create_ticket')
                .setLabel('Créer un ticket')
                .setStyle('PRIMARY')
        );

    message.channel.send({ embeds: [embed], components: [row] }).then(sentMessage => {
        const filter = (interaction) => interaction.isButton() && interaction.customId === 'create_ticket' && interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (interaction) => {
            interaction.deferUpdate();
            const ticketChannel = await message.guild.channels.create(`${message.author.tag}-ticket`, { type: 'GUILD_TEXT', parent: categoryID });
            await ticketChannel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false });
            await ticketChannel.permissionOverwrites.edit(message.author, { VIEW_CHANNEL: true });
            const modRole = message.guild.roles.cache.find(role => role.name === "Modérateur");
            if (modRole) {
                await ticketChannel.permissionOverwrites.edit(modRole, { VIEW_CHANNEL: true });
            }
            interaction.followUp({ content: `Ticket créé : <#${ticketChannel.id}>` });
        });

        collector.on('end', () => {
            if (!sentMessage.deleted) {
                sentMessage.edit({ components: [] });
            }
        });
    }).catch(console.error);
}

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

login();
