// IMPORT THINGS
const { guildID, token, fApiKey, fAuthDomain, fDatabaseURL, fProjectId, fStorageBucket, fMessagingSenderId, fAppId, s2ID } = require("./config.json");
const { Client, GatewayIntentBits, InteractionType, EmbedBuilder, ActivityType, MessageFlags } = require("discord.js");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set, onValue } = require("firebase/database");

// FIREBASE CONFIGURATION
const firebaseConfig = {
	apiKey: fApiKey,
	authDomain: fAuthDomain,
	databaseURL: fDatabaseURL,
	projectId: fProjectId,
	storageBucket: fStorageBucket,
	messagingSenderId: fMessagingSenderId,
	appId: fAppId,
};
initializeApp(firebaseConfig);

// MAKE THE CLIENT
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	presence: { activities: [{ name: "Obsidian_Seal", type: ActivityType.Watching }] },
});

// START THE CLIENT
let startTime = 0;
client.login(token);
client.once("ready", () => {
	startTime = Date.now();
	console.log("\x1b[32mOmega Seal is now online!\n");

	client.channels.cache
		.get("755823609523470407")
		.send(`## <:ss5:1120342653259759686> Omega Seal is now online! <:ss5:1120342653259759686>\n-# v1.2.0 @ ${startTime} = <t:${Math.round(startTime / 1000)}:R>`);
});

// CLIENT LISTENERS
client.on("guildMemberAdd", async (member) => {
	if (member.guild.id == guildID)
		await client.channels.cache
			.get("755817169039917147")
			.send(
				`## <:ssseal:1236461048270164020> Welcome to Seal Squad <@${member.id}>! <:ssseal:1236461048270164020>\n-# member #${member.guild.memberCount}\n- please read the <#755785157562335324>\n- catch up on the latest <#755784977399939214>\n- watch some <#755816833671626963>\n- vote in <#763475121788157983>\n- and start chatting in the many channels!\n\n:identification_card: **Please get a role by joining The Square.**\n> use \`/join\` to join\n> use \`/help\` for help\n-# bot commands can be used in any of the CHAT channels`
			);
	if (member.guild.id == s2ID)
		await client.channels.cache
			.get("1349764047234662503")
			.send(
				`## <:cep:1373149617557995600> Welcome to Civil Engineers’ Paradise <@${member.id}>! <:cep:1373149617557995600>\n-# member #${member.guild.memberCount}\n- please read the <#1349772402808324168>\n- catch up on the latest <#1349772354389016627>\n- become familiar with the server <#1349772421355536406>\n- look at who else is here in the list of <#1349773357037650002>\n- and start chatting in the many channels!`
			);
});

// REGION LIST ("THE SQUARE")
const regions = [
	"dark-red",
	"red",
	"orange",
	"dark-yellow",
	"yellow",
	"gold",
	"lime",
	"green",
	"dark-green",
	"olive",
	"teal",
	"turquoise",
	"light-blue",
	"cyan",
	"blue",
	"dark-blue",
	"magenta",
	"fuchsia",
	"pink",
	"lavender",
	"violet",
	"purple",
];

// ROLE LIST ("THE SQUARE")
const roles = [
	"998315343753789552",
	"998314840785420309",
	"998315847288377455",
	"998316318786854993",
	"998316074762256515",
	"998317045684904038",
	"998316871122161784",
	"998316954253262939",
	"998316961094176839",
	"998316966454505624",
	"998316971823206421",
	"998316981088440341",
	"998316992593412156",
	"998316986650079312",
	"998317000117993542",
	"998317005105008783",
	"998317015334924471",
	"998317021450223747",
	"998317010729570424",
	"998317027364175872",
	"998317032804200539",
	"998317040538497044",
];

// RESPOND TO SLASH COMMANDS
client.on("interactionCreate", async (interaction) => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;
	const { commandName } = interaction;

	// "/ping" - send latency information
	if (commandName === "ping") {
		try {
			let botPing = Date.now() - interaction.createdTimestamp;
			let wsPing = client.ws.ping;

			await interaction.reply(`:ping_pong: **Pong!**\n> bot ping: \`${botPing}\`ms\n> API ping: \`${wsPing}\`ms`);

			commandLogMessage(interaction, `${botPing} & ${wsPing}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/join" - join a region of The Square
	if (commandName === "join") {
		try {
			const string = interaction.options.getString("region").toLowerCase().replaceAll(/ /g, "");

			if (!interaction.inGuild() || interaction.guild.id != guildID) {
				await interaction.reply({
					content: `:warning: This command is only available in [**Seal Squad**](https://pinniped.page/discord). Visit [pinniped.page/projects/omega-seal](https://pinniped.page/projects/omega-seal) for more information.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `!!! (not Seal Squad)`);
				return;
			}

			let member = interaction.member;

			if (regions.includes(string)) {
				roles.forEach((id) => {
					if (member.roles.cache.has(id)) {
						let role = member.guild.roles.cache.find((role) => role.id === id);
						member.roles.remove(role);
					}
				});

				let role = member.guild.roles.cache.find((role) => role.id === roles[regions.indexOf(string)]);
				member.roles.add(role);

				await interaction.reply(`:grin: You are now a <@&${role.id}>!`);
			} else {
				await interaction.reply({
					content: `:warning: \`${string}\` is not one of [**The Square**](https://pinniped.page/images/the-square.png)’s regions. Visit [pinniped.page/projects/the-square](https://pinniped.page/projects/the-square) for more information.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `??? (${string})`);
				return;
			}

			commandLogMessage(interaction, `${string}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/leave" - leave The Square
	if (commandName === "leave") {
		try {
			if (!interaction.inGuild() || interaction.guild.id != guildID) {
				await interaction.reply({
					content: `:warning: This command is only available in [**Seal Squad**](https://pinniped.page/discord). Visit [pinniped.page/projects/omega-seal](https://pinniped.page/projects/omega-seal) for more information.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `!!! (not Seal Squad)`);
				return;
			}

			let member = interaction.member;
			let role, region;

			roles.forEach((id) => {
				if (member.roles.cache.has(id)) {
					role = member.guild.roles.cache.find((role) => role.id === id);
					member.roles.remove(role);
					region = regions[roles.indexOf(id)];
				}
			});

			if (region == null) {
				await interaction.reply({
					content: `:warning: You have to join [**The Square**](https://pinniped.page/images/the-square.png) before you can leave! Visit https://pinniped.page/projects/the-square for more information.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `!!! (not in The Square)`);
				return;
			}

			await interaction.reply(`:pensive: You are no longer a <@&${role.id}>.`);
			commandLogMessage(interaction, `${region}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/text" - post a message to pinniped.page/text
	if (commandName === "text") {
		try {
			const text = interaction.options.getString("message");

			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hours = date.getUTCHours();
			let minutes = date.getMinutes();

			if (month < 10) month = `0${month}`;
			if (day < 10) day = `0${day}`;

			const db = getDatabase();
			push(ref(db, "text"), {
				text: text,
				date: {
					year: year,
					month: month,
					day: day,
				},
				time: {
					hours: hours,
					minutes: minutes,
				},
			});

			await interaction.reply(":pencil: Your message has been sent to [pinniped.page/text](https://pinniped.page/text).");
			commandLogMessage(interaction, `${text}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/text-space" - special text emphasis
	if (commandName === "text-space") {
		try {
			const text = interaction.options.getString("text");
			const newText = text.split("").join(" ");

			await interaction.reply(`:pen_ballpoint: The text you entered (\`${text}\`) has been expanded.\n${newText}\n-# WARNING: user-generated content`);
			commandLogMessage(interaction, `“${text}” >>> “${newText}”`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/embed" - generate a custom embed
	if (commandName === "embed") {
		try {
			const title = interaction.options.getString("title");
			const description = interaction.options.getString("description");
			const colour = interaction.options.getString("colour");

			if (!/^#?[0123456789ABCDEFabcdef]{6}$/.test(colour)) {
				await interaction.reply({
					content: `:warning: \`${colour}\` is not a valid colour (HEX code) string. Valid colour strings follow the form \`^#?[0123456789ABCDEFabcdef]{6}$\`.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `${title} & ${description} & ${colour} (invalid colour)`);
				return;
			}

			const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(colour);
			await interaction.reply({ content: `:tools: Embed generated!\n-# WARNING: user-generated content`, embeds: [embed] });

			commandLogMessage(interaction, `${title} & ${description} & ${colour}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/help" - help message
	if (commandName === "help") {
		try {
			await interaction.reply({
				content: ":palm_up_hand: **This might help.**\n> about <@960236750830194688>: [pinniped.page/omega-seal](https://pinniped.page/omega-seal)\n> about The Square: [pinniped.page/the-square](https://pinniped.page/the-square)\n> <@960236750830194688>’s GitHub repository: [github.com/ObsidianSeal/Omega-Seal-The-Square](https://github.com/ObsidianSeal/Omega-Seal-The-Square)\n> bot status: [pinniped.page/status#DISCORD%20BOT](https://pinniped.page/status#DISCORD%20BOT)\n> more help: [pinniped.page/contact](https://pinniped.page/contact)",
				flags: MessageFlags.SuppressEmbeds,
			});

			commandLogMessage(interaction, `...`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}
});

// INITIAL DATABASE STUFF
const db = getDatabase();
const botStatusRef = ref(db, "omega-seal/status");
const botContactFormMessagesRef = ref(db, "omega-seal/contact-form-messages");

// LISTEN TO 'omega-seal/status'
onValue(botStatusRef, async (snapshot) => {
	if (startTime != 0) {
		const receivedData = snapshot.val();

		databaseLogMessage(false, "omega-seal/status", receivedData);

		// I will change this when I update the website
		if (receivedData == "offline") {
			let statusUpdate = {
				online: true,
				startTime: startTime,
			};

			try {
				await set(botStatusRef, statusUpdate);
				databaseLogMessage(true, "omega-seal/status", statusUpdate);
			} catch (error) {
				databaseErrorMessage(error);
			}
		}
	}
});

// LISTEN TO 'omega-seal/contact-form-messages'
onValue(botContactFormMessagesRef, async (snapshot) => {
	if (startTime != 0) {
		const receivedData = snapshot.val();

		databaseLogMessage(false, "omega-seal/contact-form-messages", receivedData);

		for (let messageID in receivedData) {
			const response = await client.channels.cache
				.get("755823609523470407")
				.send(
					`<@390612175137406978>\n## CONTACT FORM SUBMISSION RECEIVED\n-# \`${messageID}\` @ ${startTime} = <t:${Math.round(Date.now() / 1000)}:R>\n**TYPE:** ${
						receivedData[messageID].typeSelected
					}\n**PRIORITY:** ${receivedData[messageID].prioritySelected}\n**SUBJECT:** \`${receivedData[messageID].messageSubject}\`\n\`\`\`md\n${
						receivedData[messageID].messageBody
					}\`\`\` `
				);
			response.react("☑️");
			try {
				await set(ref(db, `omega-seal/contact-form-messages/${messageID}`), null);
				databaseLogMessage(true, `omega-seal/contact-form-messages/${messageID}`, null);
			} catch (error) {
				databaseErrorMessage(error);
			}
		}
	}
});

// UTILITY: LOG COMMAND USAGE TO CONSOLE
async function commandLogMessage(interaction, message) {
	let username, displayName;

	if (interaction.inGuild()) {
		username = interaction.member.user.username;
		displayName = interaction.member.user.displayName;
	} else {
		username = interaction.user.username;
		displayName = "\x1b[33m[DM]\x1b[37m";
	}

	console.log(`\x1b[35m> /${interaction.commandName}\x1b[37m — ${message} | ${displayName} (${username})\x1b[37m`);
}

// UTILITY: LOG DATABASE UPDATES TO CONSOLE
async function databaseLogMessage(direction, path, content) {
	let colourText = "\x1b[34m[db] RECEIVE";
	if (direction) colourText = "\x1b[36m[db] SEND";

	console.log(`${colourText} @ ${path}\x1b[37m ${content}`);
	console.log(content);
}

// UTILITY: LOG DATABASE ERRORS
async function databaseErrorMessage(error) {
	console.log(`\x1b[31mERROR!!\x1b[37m`);
	console.log(error);
}

// UTILITY: ERROR RESPONSE & LOG TO CONSOLE
async function errorMessage(interaction, commandName, error) {
	await interaction.reply({
		content: `:fearful: Something went wrong....\n\`\`\`diff\n- ERROR!!\n- ${error}\n\`\`\`\n:bug: **Please report bugs!**\n> report issues here: [pinniped.page/contact](https://pinniped.page/contact)\n> for general <@960236750830194688> help, use \`/help\``,
		flags: MessageFlags.Ephemeral,
	});
	console.log(`\x1b[31mERROR!! (/${commandName})\x1b[37m`);
	console.log(error);
}

/*
 * colours (for the VSCode theme I use)
 * ----------------------------------------
 * RED = \x1b[31m (errors)
 * ORANGE = \x1b[34m (database receive)
 * YELLOW = \x1b[33m (special)
 * GREEN = \x1b[32m (successes)
 * BLUE = \x1b[36m (database send)
 * PURPLE = \x1b[35m (command logs)
 * reset = \x1b[37m
 */

console.log("\x1b[31m.\x1b[34m.\x1b[33m.\x1b[32m.\x1b[36m.\x1b[35m.\n");
