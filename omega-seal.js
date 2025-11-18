// IMPORT THINGS
const { guildID, token, fApiKey, fAuthDomain, fDatabaseURL, fProjectId, fStorageBucket, fMessagingSenderId, fAppId, s2ID } = require("./config.json");
const { Client, GatewayIntentBits, InteractionType, EmbedBuilder, ActivityType, MessageFlags } = require("discord.js");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set, onValue } = require("firebase/database");
const { transit_realtime } = require("gtfs-realtime-bindings");

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

// INITIAL DATABASE STUFF
const db = getDatabase();
const botStatusRef = ref(db, "omega-seal/status");
const botContactFormMessagesRef = ref(db, "omega-seal/contact-form-messages");

// MAKE THE CLIENT
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	presence: { activities: [{ name: "Obsidian_Seal", type: ActivityType.Watching }] },
});

// START THE CLIENT
let startTime = 0;
client.login(token);
client.once("ready", async () => {
	startTime = Date.now();
	console.log("\x1b[32mOmega Seal is now online!\n");

	client.channels.cache
		.get("755823609523470407")
		.send(`## <:ss5:1120342653259759686> Omega Seal is now online! <:ss5:1120342653259759686>\n-# v1.4.2 @ ${startTime} = <t:${Math.round(startTime / 1000)}:R>`);

	statusListener();
	contactFormMessagesListener();
});

// CLIENT LISTENERS
client.on("guildMemberAdd", async (member) => {
	// await member.guild.members.fetch(); // this is present in "/populations" - should it be here too?

	if (member.guild.id == guildID)
		await client.channels.cache
			.get("755817169039917147")
			.send(
				`## <:ssseal:1236461048270164020> Welcome to Seal Squad <@${member.id}>! <:ssseal:1236461048270164020>\n-# member #\${member.guild.memberCount}\n- please read the <#755785157562335324>\n- catch up on the latest <#755784977399939214>\n- watch some <#755816833671626963>\n- vote in <#763475121788157983>\n- and start chatting in the many channels!\n\n:identification_card: **Please get a role by joining The Square.**\n> use \`/join\` to join\n> use \`/help\` for help\n-# bot commands can be used in any of the CHAT channels`
			);
	if (member.guild.id == s2ID)
		await client.channels.cache
			.get("1349764047234662503")
			.send(
				`## <:cep:1373149617557995600> Welcome to Civil Engineers’ Paradise <@${member.id}>! <:cep:1373149617557995600>\n-# member #\${member.guild.memberCount}\n- please read the <#1349772402808324168>\n- catch up on the latest <#1349772354389016627>\n- become familiar with the server <#1349772421355536406>\n- look at who else is here in the list of <#1349773357037650002>\n- and start chatting in the many channels!`
			);
	if (member.guild.id == s3ID)
		await client.channels.cache
			.get("1440055859685232840")
			.send(
				`## <:cive29:1440073698345357392> Welcome to CIVE ’29 <@${member.id}>! <:cive29:1440073698345357392>\n-# member #\${member.guild.memberCount} — congratulations on your successful <#1440055799333523496>\n- please read the <#1440044198148575385>\n- catch up on the latest <#1440044178448056382>\n- check out the <#1440044224782405633>\n- start chatting here in <#1440055859685232840> and then head over to the many other specific channels!`
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
					content: `:warning: This command is only available in [**Seal Squad**](https://pinniped.page/discord). Visit [pinniped.page/omega-seal](https://pinniped.page/projects/omega-seal) for more information.`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
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

				await interaction.reply({
					content: `:grin: You are now a <@&${role.id}>!\n-# learn more about your region at [pinniped.page/the-square#${string}](https://pinniped.page/projects/the-square#${string})`,
					flags: MessageFlags.SuppressEmbeds,
				});
			} else {
				await interaction.reply({
					content: `:warning: \`${string}\` is not one of [**The Square**](https://pinniped.page/projects/the-square)’s regions. Visit [pinniped.page/the-square](https://pinniped.page/projects/the-square) for more information.`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
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
					content: `:warning: This command is only available in [**Seal Squad**](https://pinniped.page/discord). Visit [pinniped.page/omega-seal](https://pinniped.page/projects/omega-seal) for more information.`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
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
					content: `:warning: You have to join [**The Square**](https://pinniped.page/projects/the-square) before you can leave! Visit [pinniped.page/the-square](https://pinniped.page/projects/the-square) for more information.`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
				});
				commandLogMessage(interaction, `!!! (not in The Square)`);
				return;
			}

			await interaction.reply(`:pensive: You are no longer a <@&${role.id}>\n-# please note that you can move regions without leaving The Square`);
			commandLogMessage(interaction, `${region}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/populations" - regions of The Square, sorted by member count
	if (commandName === "populations") {
		try {
			if (!interaction.inGuild() || interaction.guild.id != guildID) {
				await interaction.reply({
					content: `:warning: This command is only available in [**Seal Squad**](https://pinniped.page/discord). Visit [pinniped.page/omega-seal](https://pinniped.page/projects/omega-seal) for more information.`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
				});
				commandLogMessage(interaction, `!!! (not Seal Squad)`);
				return;
			}

			await interaction.guild.members.fetch();

			let memberCounts = [];
			let memberTotal = 0;
			for (let i = 0; i < regions.length; i++) {
				const role = interaction.guild.roles.cache.find((role) => role.id === roles[i]);
				const memberCount = role.members.size;
				memberCounts.push([regions[i], memberCount]);
				memberTotal += memberCount;
			}
			memberCounts.sort(function (a, b) {
				return b[1] - a[1];
			});

			let regionListString = "";
			for (let i = 0; i < regions.length; i++) {
				regionListString += `\n${i + 1}. \`${memberCounts[i][0]}\` **${memberCounts[i][1].toLocaleString("en-CA")}**`;
			}

			await interaction.reply({
				content: `## :crown: The Square :crown:\n-# all 22 regions, sorted by member count (${memberTotal.toLocaleString(
					"en-CA"
				)} total) ${regionListString}\n-# learn more about The Square at [pinniped.page/the-square](https://pinniped.page/projects/the-square)`,
				flags: MessageFlags.SuppressEmbeds,
			});
			commandLogMessage(interaction, `...`);
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

			await interaction.reply({
				content: ":pencil: Your message has been sent to [pinniped.page/text](https://pinniped.page/projects/text).",
				flags: MessageFlags.SuppressEmbeds,
			});
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

			if (!/^#?[0-9A-Fa-f]{6}$/.test(colour)) {
				await interaction.reply({
					content: `:warning: \`${colour}\` is not a valid colour (HEX code) string. Valid colour strings follow the form \`^#?[0-9A-Fa-f]{6}$\`.`,
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

	// "/metar" - get a METAR report from a specified airport
	if (commandName === "metar") {
		try {
			const airport = interaction.options.getString("airport").toUpperCase();

			if (!/^[A-Z]{4}$/.test(airport)) {
				await interaction.reply({
					content: `:warning: \`${airport}\` is not a valid ICAO airport code. Valid ICAO airport codes follow the form \`^[A-Z]{4}$\`.`,
					flags: MessageFlags.Ephemeral,
				});
				commandLogMessage(interaction, `??? (invalid ICAO airport code)`);
				return;
			}

			const requestURL = `https://aviationweather.gov/api/data/metar?ids=${airport}`;
			const request = new Request(requestURL);
			const response = await fetch(request);
			const text = await response.text();

			if (text == "") {
				await interaction.reply({
					content: `:airplane_small: There is no [METAR](https://en.wikipedia.org/wiki/METAR) data available for \`${airport}\`. Either that airport doesn’t exist or its METAR reports are not public. Sorry!`,
					flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
				});
				commandLogMessage(interaction, `??? (no response)`);
				return;
			}

			await interaction.reply({
				content: `:airplane: Here is the latest [METAR](https://en.wikipedia.org/wiki/METAR) report for \`${airport}\`.\n-# source: [aviationweather.gov/api/data/metar?ids=${airport}](https://aviationweather.gov/api/data/metar?ids=${airport})\n\`\`\`${text}\`\`\``,
				flags: MessageFlags.SuppressEmbeds,
			});
			commandLogMessage(interaction, text);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/ion" - see when the next ION trains are coming to UW station
	if (commandName === "ion") {
		try {
			let southboundTime = Infinity;
			let northboundTime = Infinity;

			let southboundGradeCrossingTime = Infinity;
			let northboundGradeCrossingTime = Infinity;

			let southboundGradeCrossingTimeOffset = 50;
			let northboundGradeCrossingTimeOffset = 10;

			const request = new Request("https://webapps.regionofwaterloo.ca/api/grt-routes/api/tripupdates");
			const response = await fetch(request);
			const feed = transit_realtime.FeedMessage.decode(new Uint8Array(await response.arrayBuffer()));

			for (let i = 0; i < feed.entity.length; i++) {
				if (feed.entity[i].tripUpdate.trip.routeId == "301") {
					for (let j = 0; j < feed.entity[i].tripUpdate.stopTimeUpdate.length; j++) {
						if (feed.entity[i].tripUpdate.stopTimeUpdate[j].stopId == "6004") {
							if (Object.keys(feed.entity[i].tripUpdate.stopTimeUpdate[j]).includes("arrival")) {
								if (Object.keys(feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival).includes("time")) {
									let time = feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival.time.low;
									let gradeCrossingTime = time - southboundGradeCrossingTimeOffset;

									if (time < southboundTime && time > Math.floor(Date.now() / 1000)) {
										southboundTime = time;
									}
									if (gradeCrossingTime < southboundGradeCrossingTime && gradeCrossingTime > Math.floor(Date.now() / 1000)) {
										southboundGradeCrossingTime = gradeCrossingTime;
									}
								}
							}
						}
						if (feed.entity[i].tripUpdate.stopTimeUpdate[j].stopId == "6120") {
							if (Object.keys(feed.entity[i].tripUpdate.stopTimeUpdate[j]).includes("arrival")) {
								if (Object.keys(feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival).includes("time")) {
									let time = feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival.time.low;
									let gradeCrossingTime = time - northboundGradeCrossingTimeOffset;

									if (time < northboundTime && time > Math.floor(Date.now() / 1000)) {
										northboundTime = time;
									}
									if (gradeCrossingTime < northboundGradeCrossingTime && gradeCrossingTime > Math.floor(Date.now() / 1000)) {
										northboundGradeCrossingTime = gradeCrossingTime;
									}
								}
							}
						}
					}
				}
			}

			replyText = `## :station: ION train arrivals :alarm_clock:\n-# to University of Waterloo Station\n- SOUTHBOUND: not in service\n- NORTHBOUND: not in service\n-# please submit a bug report if you believe there is an error`;

			if (southboundTime != Infinity && northboundTime != Infinity) {
				replyText = `## :station: ION train arrivals :alarm_clock:\n-# to University of Waterloo Station\n- SOUTHBOUND: <t:${southboundTime}:R> (${formatTime(
					new Date(southboundTime * 1000)
				)})\n- NORTHBOUND: <t:${northboundTime}:R> (${formatTime(
					new Date(northboundTime * 1000)
				)})\n-# theoretical & roughly estimated Transit Plaza grade crossing activation time: <t:${Math.min(
					southboundGradeCrossingTime,
					northboundGradeCrossingTime
				)}:R> (${formatTime(new Date(Math.min(southboundGradeCrossingTime, northboundGradeCrossingTime) * 1000))})`;
			}
			if (southboundTime != Infinity && northboundTime == Infinity) {
				replyText = `## :station: ION train arrivals :alarm_clock:\n-# to University of Waterloo Station\n- SOUTHBOUND: <t:${southboundTime}:R> (${formatTime(
					new Date(southboundTime * 1000)
				)})\n- NORTHBOUND: not in service\n-# theoretical & roughly estimated Transit Plaza grade crossing activation time: <t:${Math.min(
					southboundGradeCrossingTime,
					northboundGradeCrossingTime
				)}:R> (${formatTime(new Date(Math.min(southboundGradeCrossingTime, northboundGradeCrossingTime) * 1000))})`;
			}
			if (southboundTime == Infinity && northboundTime != Infinity) {
				replyText = `## :station: ION train arrivals :alarm_clock:\n-# to University of Waterloo Station\n- SOUTHBOUND: not in service\n- NORTHBOUND: <t:${northboundTime}:R> (${formatTime(
					new Date(northboundTime * 1000)
				)})\n-# theoretical & roughly estimated Transit Plaza grade crossing activation time: <t:${Math.min(
					southboundGradeCrossingTime,
					northboundGradeCrossingTime
				)}:R> (${formatTime(new Date(Math.min(southboundGradeCrossingTime, northboundGradeCrossingTime) * 1000))})`;
			}

			await interaction.reply(replyText);
			commandLogMessage(interaction, `${southboundTime}, ${northboundTime}`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}

	// "/help" - help message
	if (commandName === "help") {
		try {
			await interaction.reply({
				content: ":palm_up_hand: **This might help.**\n> about <@960236750830194688>: [pinniped.page/omega-seal](https://pinniped.page/projects/omega-seal)\n> about The Square: [pinniped.page/the-square](https://pinniped.page/projects/the-square)\n> <@960236750830194688>’s GitHub repository: [github.com/ObsidianSeal/Omega-Seal-The-Square](https://github.com/ObsidianSeal/Omega-Seal-The-Square)\n> bot status: [pinniped.page/status#DISCORD-BOT](https://pinniped.page/status#DISCORD-BOT)\n> more help: [pinniped.page/contact](https://pinniped.page/contact)",
				flags: MessageFlags.SuppressEmbeds,
			});

			commandLogMessage(interaction, `...`);
		} catch (error) {
			errorMessage(interaction, commandName, error);
		}
	}
});

// LISTEN TO 'omega-seal/status'
function statusListener() {
	onValue(botStatusRef, async (snapshot) => {
		const receivedData = snapshot.val();

		databaseLogMessage(false, "omega-seal/status", receivedData);

		// omega seal page ping
		if (receivedData == "offline" || receivedData == "populations") {
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

		// update populations
		if (receivedData == "populations") {
			let populations = {};

			const guild = client.guilds.cache.get(guildID);
			await guild.members.fetch();

			for (let i = 0; i < regions.length; i++) {
				const role = guild.roles.cache.find((role) => role.id === roles[i]);
				const population = role.members.size;
				populations[regions[i]] = population;
			}

			try {
				await set(ref(db, `omega-seal/the-square`), populations);
				databaseLogMessage(true, "omega-seal/the-square", populations);
			} catch (error) {
				databaseErrorMessage(error);
			}
		}
	});
}

// prevent sending alerts more than once
let messageIDs = [];

// LISTEN TO 'omega-seal/contact-form-messages'
function contactFormMessagesListener() {
	onValue(botContactFormMessagesRef, async (snapshot) => {
		const receivedData = snapshot.val();

		databaseLogMessage(false, "omega-seal/contact-form-messages", receivedData);

		for (let messageID in receivedData) {
			if (!messageIDs.includes(messageID)) messageIDs.push(messageID);
			else continue;

			if (
				Object.keys(receivedData[messageID]).length != 5 ||
				!Object.keys(receivedData[messageID]).includes("typeSelected") ||
				!Object.keys(receivedData[messageID]).includes("prioritySelected") ||
				!Object.keys(receivedData[messageID]).includes("messageSubject") ||
				!Object.keys(receivedData[messageID]).includes("messageBody") ||
				!Object.keys(receivedData[messageID]).includes("timestamp")
			) {
				continue;
			}

			let type = receivedData[messageID].typeSelected.toString();
			let priority = receivedData[messageID].prioritySelected.toString();
			let subject = receivedData[messageID].messageSubject.toString().replaceAll(/`/g, "<backtick>");
			let body = receivedData[messageID].messageBody.toString().replaceAll(/```/g, "<backticks>");
			let timestamp = parseInt(receivedData[messageID].timestamp);

			if (!["ISSUES", "COMMENTS", "SUGGESTIONS", "QUESTIONS", "HELP", "OTHER"].includes(type)) continue;
			if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) continue;

			if (subject.length > 100 || subject.length == 0) continue;
			if (body.length > 1500 || body.length == 0) continue;

			if (timestamp < 1750000000000 || timestamp > Date.now() + 86400000 || isNaN(timestamp)) continue;

			const response = await client.channels.cache
				.get("1395802045998567465")
				.send(
					`<@390612175137406978>\n## CONTACT FORM SUBMISSION RECEIVED\n-# \`${messageID}\` @ ${timestamp} = <t:${Math.round(
						timestamp / 1000
					)}:R>\n**TYPE:** ${type}\n**PRIORITY:** ${priority}\n**SUBJECT:** \`${subject}\`\n\`\`\`md\n${body}\`\`\``
				);
			response.react("☑️");
			try {
				await set(ref(db, `omega-seal/contact-form-messages/${messageID}`), null);
				databaseLogMessage(true, `omega-seal/contact-form-messages/${messageID}`, null);
			} catch (error) {
				databaseErrorMessage(error);
			}
		}
	});
}

// UTILITY: FORMATE TIME FROM DATE (ADAPTED FROM THE GAME OF NUMBERS)
function formatTime(date) {
	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();

	let half = "AM";
	if (hour >= 12) half = "PM";
	if (hour == 0) hour = 12;
	if (hour > 12) hour = hour % 12;

	return `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} ${half}`;
}

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

	console.log(`\x1b[35m> /${interaction.commandName}\x1b[37m — ${message} | ${displayName} (${username})\x1b[37m [${Date.now()}]`);
}

// UTILITY: LOG DATABASE UPDATES TO CONSOLE
async function databaseLogMessage(direction, path, content) {
	let colourText = "\x1b[34m[db] RECEIVE";
	if (direction) colourText = "\x1b[36m[db] SEND";

	console.log(`${colourText} @ ${path}\x1b[37m ${content} [${Date.now()}]`);
	console.log(content);
}

// UTILITY: LOG DATABASE ERRORS
async function databaseErrorMessage(error) {
	console.log(`\x1b[31mERROR!!\x1b[37m [${Date.now()}]`);
	console.log(error);
}

// UTILITY: ERROR RESPONSE & LOG TO CONSOLE
async function errorMessage(interaction, commandName, error) {
	await interaction.reply({
		content: `:fearful: Something went wrong....\n\`\`\`diff\n- ERROR!!\n- ${error}\n\`\`\`\n:bug: **Please report bugs!**\n> report issues here: [pinniped.page/contact](https://pinniped.page/contact)\n> for general <@960236750830194688> help, use \`/help\``,
		flags: MessageFlags.Ephemeral,
	});
	console.log(`\x1b[31mERROR!! (/${commandName})\x1b[37m [${Date.now()}]`);
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
