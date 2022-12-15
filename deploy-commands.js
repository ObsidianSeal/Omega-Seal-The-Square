const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("See Omega Seal's ping."),
	new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join one of The Square's regions and change the colour of your name.")
		.addStringOption((option) => option.setName("region").setDescription("The region you would like to move to and the colour you want your name to be.").setRequired(true)),
	new SlashCommandBuilder().setName("leave").setDescription("Leave The Square. (Remove name colour.)"),
	new SlashCommandBuilder().setName("stop").setDescription("Stop the bot."),
	new SlashCommandBuilder()
		.setName("text")
		.setDescription("Send a message on my website.")
		.addStringOption((option) => option.setName("message").setDescription("The text you want to send.").setRequired(true)),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
