const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("See Omega Seal's ping."),
	new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join one of The Square's regions and change the colour of your name.")
		.addStringOption((option) => option.setName("region").setDescription("The region you want to move to and the colour you want your name to be.").setRequired(true)),
	new SlashCommandBuilder().setName("leave").setDescription("Leave The Square and reset the colour of your name."),
	new SlashCommandBuilder().setName("stop").setDescription("Stop the bot."),
	new SlashCommandBuilder()
		.setName("text")
		.setDescription("Send a message on my website.")
		.addStringOption((option) => option.setName("message").setDescription("The text you want to send.").setRequired(true)),
	new SlashCommandBuilder()
		.setName("text-space")
		.setDescription("Give your text some s p a c e.")
		.addStringOption((option) => option.setName("text").setDescription("The text you want to space out.").setRequired(true)),
	new SlashCommandBuilder()
		.setName("embed")
		.setDescription("Send a custom embed.")
		.addStringOption((option) => option.setName("title").setDescription("Embed title.").setRequired(true))
		.addStringOption((option) => option.setName("description").setDescription("Embed description.").setRequired(true))
		.addStringOption((option) => option.setName("colour").setDescription("Embed colour (hex code).").setRequired(false)),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
