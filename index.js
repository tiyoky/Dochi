const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
const ownerID = '1018206885704372274';

client.on('message', async message => {
  if (!message.content.startsWith('+start')) return;

  const args = message.content.slice('+start'.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === '') return;

  const numberOfAccounts = parseInt(command);

  if (!isNaN(numberOfAccounts)) {
    const server = message.guild;
    for (let i = 0; i < numberOfAccounts; i++) {
      try {
        const username = `FakeUser${i}`;
        await server.members.create({
          user: {
            username,
            password: 'SomeSecurePassword' // Just a placeholder, replace with your own secure password
          }
        });
        console.log(`Fake account ${username} joined the server ${server.name}`);
      } catch (error) {
        console.error(`Failed to create fake account: ${error}`);
      }
    }
  } else {
    message.channel.send('Invalid command. Please use "+start (number)" to create fake accounts.');
  }
});

client.login('YOUR_BOT_TOKEN');


client.on('message', async message => {
  if (!message.content.startsWith('+start')) return;

  const args = message.content.slice('+start'.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === '') return;

  const numberOfAccounts = parseInt(command);

  if (!isNaN(numberOfAccounts)) {
    const server = message.guild;
    for (let i = 0; i < numberOfAccounts; i++) {
      try {
        const username = `FakeUser${i}`;
        await server.members.create({
          user: {
            username,
            password: 'SomeSecurePassword' // Just a placeholder, replace with your own secure password
          }
        });
        console.log(`Fake account ${username} joined the server ${server.name}`);
      } catch (error) {
        console.error(`Failed to create fake account: ${error}`);
      }
    }
  } else {
    message.channel.send('Invalid command. Please use "+start (number)" to create fake accounts.');
  }
});

client.login('process.env.TOKEN');
