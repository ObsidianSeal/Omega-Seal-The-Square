// IMPORT THINGS
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientID, guildID, token } = require("./config.json");

// MAKE COMMANDS
const commands = [
	// "/ping"
	new SlashCommandBuilder().setName("ping").setDescription("Latency information."),

	// "/join"
	new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join one of The Square’s regions and change the colour of your name.")
		.addStringOption((option) => option.setName("region").setDescription("The region you want to move to and the colour you want your name to be.").setRequired(true)),

	// "/leave"
	new SlashCommandBuilder().setName("leave").setDescription("Leave The Square and reset the colour of your name."),

	// "/stop"
	// new SlashCommandBuilder().setName("stop").setDescription("Stop Omega Seal. [DEPRECATED]"),

	// "/text"
	new SlashCommandBuilder()
		.setName("text")
		.setDescription("Send a message on my website’s chat page.")
		.addStringOption((option) => option.setName("message").setDescription("The text you want to send.").setRequired(true).setMaxLength(120)),

	// "/text-space"
	new SlashCommandBuilder()
		.setName("text-space")
		.setDescription("Put a space between every character in some text.")
		.addStringOption((option) => option.setName("text").setDescription("The text you want to add spaces to.").setRequired(true)),

	// "/embed"
	new SlashCommandBuilder()
		.setName("embed")
		.setDescription("Send a custom embed.")
		.addStringOption((option) => option.setName("title").setDescription("The embed’s title.").setRequired(true))
		.addStringOption((option) => option.setName("description").setDescription("The embed’s description.").setRequired(true))
		.addStringOption((option) => option.setName("colour").setDescription("The embed’s accent colour.").setRequired(false).setMinLength(6).setMaxLength(7)),

	// "/help"
	new SlashCommandBuilder().setName("help").setDescription("Send this command if you don’t know how to use the bot or if you just want to learn more about it."),
].map((command) => command.toJSON());

const rest = new REST().setToken(token);

// SEND THE COMMANDS TO DISCORD
rest.put(Routes.applicationCommands(clientID), { body: commands }) // use "body: []" to remove all; requires re-adding the bot to servers after commands are restored
	.then(() => console.log("\x1b[32mOmega Seal’s “application commands” have successfully been registered with Discord."))
	.catch(console.error);

// DELETE A COMMAND
// let commandID = 0;
// rest.delete(Routes.applicationCommands(clientID, commandID))
// 	.then(() => console.log(`\x1b[32m${commandID} has successfully been deleted from Discord.`))
// 	.catch(console.error);
