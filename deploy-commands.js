// IMPORTS
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST, Routes } = require("discord.js");
const { botID, token } = require("./config.json");

// MAKE COMMANDS
const commands = [
	// "/embed"
	new SlashCommandBuilder()
		.setName("embed")
		.setDescription("Send a custom embed.")
		.addStringOption((option) => option.setName("title").setDescription("The embed’s title.").setRequired(true))
		.addStringOption((option) => option.setName("description").setDescription("The embed’s description.").setRequired(true))
		.addStringOption((option) => option.setName("colour").setDescription("The embed’s accent colour.").setRequired(false).setMinLength(6).setMaxLength(7)),

	// "/explode"
	new SlashCommandBuilder()
		.setName("explode")
		.setDescription("Put a space between every character in some text.")
		.addStringOption((option) => option.setName("text").setDescription("The text you want to add spaces to.").setRequired(true)),

	// "/help"
	new SlashCommandBuilder().setName("help").setDescription("Send this command if you don’t know how to use the bot or if you just want to learn more about it."),

	// "/ion"
	new SlashCommandBuilder().setName("ion").setDescription("See when the next ION trains are coming to University of Waterloo Station."),

	// "/join"
	new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join one of The Square’s regions and change the colour of your name.")
		.addStringOption((option) => option.setName("region").setDescription("The region you want to move to and the colour you want your name to be.").setRequired(true)),

	// "/leave"
	new SlashCommandBuilder().setName("leave").setDescription("Leave The Square and reset the colour of your name."),

	// "/math"
	new SlashCommandBuilder()
		.setName("math")
		.setDescription("Convert text (LaTeX) into math.")
		.addStringOption((option) => option.setName("latex").setDescription("The code you want to be rendered as an image.").setRequired(true)),

	// "/metar"
	new SlashCommandBuilder()
		.setName("metar")
		.setDescription("Prepare for flight with this quick weather report.")
		.addStringOption((option) => option.setName("airport").setDescription("The ICAO airport code for the location you want a weather report from.").setRequired(true).setMinLength(4).setMaxLength(4)),

	// "/music"
	new SlashCommandBuilder().setName("music").setDescription("Get a random track from one of Obsidian_Seal’s monthly playlists."),

	// "/ping"
	new SlashCommandBuilder().setName("ping").setDescription("Latency and network speed details."),

	// "/playlist"
	new SlashCommandBuilder().setName("playlist").setDescription("Get the link to Obsidian_Seal’s latest monthly playlist."),

	// "/populations"
	new SlashCommandBuilder().setName("populations").setDescription("Check the population of each of The Square’s regions."),

	// "/role"
	new SlashCommandBuilder()
		.setName("role")
		.setDescription("Get some role information.")
		.addRoleOption((option) => option.setName("role").setDescription("The role to investigate.").setRequired(true)),

	// "/roles"
	new SlashCommandBuilder()
		.setName("roles")
		.setDescription("Roles in the server, sorted by member count.")
		.addStringOption((option) => option.setName("filter").setDescription("Filter to specific roles by providing a hex code.").setRequired(false).setMinLength(6).setMaxLength(7)),

	// "/tag"
	new SlashCommandBuilder()
		.setName("tag")
		.setDescription("Quickly update the tags applied to this forum post.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add a tag to this forum post.")
				.addStringOption((option) => option.setName("tag").setDescription("The name of an existing tag.").setRequired(true)),
		)
		.addSubcommand((subcommand) => subcommand.setName("list").setDescription("List all the tags applicable to this forum post."))
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove a tag from this forum post.")
				.addStringOption((option) => option.setName("tag").setDescription("The name of one of the tags on this post.").setRequired(true)),
		),

	// "/text"
	new SlashCommandBuilder()
		.setName("text")
		.setDescription("Send a message on pinniped.page/text.")
		.addStringOption((option) => option.setName("message").setDescription("The text you want to send.").setRequired(true).setMaxLength(120)),
].map((command) => command.toJSON());

// FOR ALL COMMAND OPERATIONS
const rest = new REST().setToken(token);

// SEND ALL COMMANDS TO DISCORD
rest.put(Routes.applicationCommands(botID), { body: commands })
	.then(() => console.log("\x1b[32mOmega Seal’s application commands have successfully been registered with Discord."))
	.catch(console.error);
