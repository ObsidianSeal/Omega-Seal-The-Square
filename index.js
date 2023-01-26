const { token, fApiKey, fAuthDomain, fDatabaseURL, fProjectId, fStorageBucket, fMessagingSenderId, fAppId } = require("./config.json");
const { Client, GatewayIntentBits, Partials, InteractionType, EmbedBuilder } = require("discord.js");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set, onValue } = require("firebase/database");

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

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

client.once("ready", () => {
	console.log("\x1b[36mOmega Seal is now online!\n\x1b[37m---");
});

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

client.on("interactionCreate", async (interaction) => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;
	const { commandName } = interaction;

	if (commandName === "ping") {
		try {
			let ping = client.ws.ping;
			await interaction.reply(`**Pong!**\n\`${ping}ms\``);
			console.log(`\x1b[35m> /ping\x1b[37m — ${ping}ms`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "join") {
		try {
			const string = interaction.options.getString("region");
			const member = interaction.member;
			var role;

			if (regions.includes(string)) {
				roles.forEach((id) => {
					if (member.roles.cache.has(id)) {
						role = member.guild.roles.cache.find((role) => role.id === id);
						member.roles.remove(role);
					}
				});

				for (let i = 0; i < regions.length; i++) {
					if (string == regions[i]) {
						role = member.guild.roles.cache.find((role) => role.id === roles[i]);
						member.roles.add(role);
					}
				}

				await interaction.reply(`You are now a citizen of \`${string}\`.`);
			} else {
				await interaction.reply({
					content: `\`${string}\` is not one of [The Square](https://pinniped.page/images/the-square.png)'s regions. Visit https://pinniped.page/projects/the-square for more information.`,
					ephemeral: true,
				});

				console.log(`\x1b[35m> /join\x1b[37m — ??? (${string}) | ${member.displayName}`);
				return;
			}

			console.log(`\x1b[35m> /join\x1b[37m — ${string} | ${member.displayName}`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "leave") {
		try {
			const member = interaction.member;
			var role, region;

			for (let i = 0; i < roles.length; i++) {
				if (member.roles.cache.has(roles[i])) {
					role = member.guild.roles.cache.find((role) => role.id === roles[i]);
					member.roles.remove(role);
					region = regions[i];
				}
			}

			if (region == null) {
				await interaction.reply({
					content: `You have to join [The Square](https://pinniped.page/images/the-square.png) before you can leave! Visit https://pinniped.page/projects/the-square for more information.`,
					ephemeral: true,
				});

				console.log(`\x1b[35m> /leave\x1b[37m — !!! | ${member.displayName}`);
				return;
			}

			await interaction.reply(`You are no longer a citizen of \`${region}\`.`);
			console.log(`\x1b[35m> /leave\x1b[37m — ${region} | ${member.displayName}`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "stop") {
		try {
			const user = interaction.member.user;

			if (user.id == "390612175137406978") {
				await interaction.reply("Stopping...");
				console.log(`\x1b[35m> /stop\x1b[37m — ${user.id == "390612175137406978"} | ${user.username}`);

				process.exit(0);
			} else {
				await interaction.reply({ content: "Only Obsidian_Seal can use this command!", ephemeral: true });
				console.log(`\x1b[35m> /stop\x1b[37m — ${user.id == "390612175137406978"} | ${user.username}`);

				const me = await client.users.fetch("390612175137406978");
				me.send(`**ALERT:** ${user} tried to use /stop.`);
			}
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

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
			const textRef = ref(db, "text");
			const autoId = push(textRef).key;

			set(ref(db, "text/" + autoId), {
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

			await interaction.reply("Message sent.");
			console.log(`\x1b[35m> /text\x1b[37m — "${text}"`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "text-space") {
		try {
			const text = interaction.options.getString("text");
			const newText = text.split("").join(" ");

			await interaction.reply(newText);
			console.log(`\x1b[35m> /text-space\x1b[37m — "${newText}"`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "embed") {
		try {
			const title = interaction.options.getString("title");
			const description = interaction.options.getString("description");
			const colour = interaction.options.getString("colour");

			const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(colour);

			await interaction.reply({ embeds: [embed] });
			console.log(`\x1b[35m> /embed\x1b[37m — "${title}", "${description}"`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}
});

client.login(token);

const db = getDatabase();
const statusRef = ref(db, "omega-seal");
let firstPing = true;

onValue(statusRef, () => {
	if (firstPing) {
		firstPing = false;
	} else {
		//console.log("\x1b[33m> Firebase ping");
		console.log("\x1b[31m> Firebase ping");
		firstPing = true;
	}

	set(statusRef, {
		status: "online",
	});
});
