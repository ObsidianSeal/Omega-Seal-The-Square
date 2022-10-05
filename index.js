const { Client, GatewayIntentBits, Partials, InteractionType } = require("discord.js");
const { token } = require("./config.json");

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
	"lavendar",
	"violet",
	"purple",
];

announceOnline = true;

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

client.once("ready", () => {
	console.log("Omega Seal is now online!");

	if (announceOnline) {
		const channel = client.channels.cache.get("755782484117160006");
		channel.send("<@960236750830194688> is now online!");
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.type === InteractionType.ApplicationCommand) return;

	const { commandName } = interaction;

	if (commandName === "ping") {
		await interaction.reply(`**Pong!**\n\`${client.ws.ping}ms\``);
	}

	if (commandName === "join") {
		const string = interaction.options.getString("region");
		const member = interaction.member;
		var role;
		var role2;

		if (regions.includes(string)) {
			try {
				if (member.roles.cache.has("998315343753789552")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998315343753789552");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998314840785420309")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998314840785420309");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998315847288377455")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998315847288377455");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316318786854993")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316318786854993");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316074762256515")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316074762256515");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317045684904038")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317045684904038");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316871122161784")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316871122161784");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316954253262939")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316954253262939");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316961094176839")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316961094176839");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316966454505624")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316966454505624");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316971823206421")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316971823206421");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316981088440341")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316981088440341");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316992593412156")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316992593412156");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998316986650079312")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998316986650079312");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317000117993542")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317000117993542");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317005105008783")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317005105008783");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317015334924471")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317015334924471");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317021450223747")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317021450223747");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317010729570424")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317010729570424");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317027364175872")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317027364175872");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317032804200539")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317032804200539");
					member.roles.remove(role2);
				}
				if (member.roles.cache.has("998317040538497044")) {
					role2 = member.guild.roles.cache.find((role2) => role2.id === "998317040538497044");
					member.roles.remove(role2);
				}

				if (string == "dark-red") {
					role = member.guild.roles.cache.find((role) => role.id === "998315343753789552");
				}
				if (string == "red") {
					role = member.guild.roles.cache.find((role) => role.id === "998314840785420309");
				}
				if (string == "orange") {
					role = member.guild.roles.cache.find((role) => role.id === "998315847288377455");
				}
				if (string == "dark-yellow") {
					role = member.guild.roles.cache.find((role) => role.id === "998316318786854993");
				}
				if (string == "yellow") {
					role = member.guild.roles.cache.find((role) => role.id === "998316074762256515");
				}
				if (string == "gold") {
					role = member.guild.roles.cache.find((role) => role.id === "998317045684904038");
				}
				if (string == "lime") {
					role = member.guild.roles.cache.find((role) => role.id === "998316871122161784");
				}
				if (string == "green") {
					role = member.guild.roles.cache.find((role) => role.id === "998316954253262939");
				}
				if (string == "dark-green") {
					role = member.guild.roles.cache.find((role) => role.id === "998316961094176839");
				}
				if (string == "olive") {
					role = member.guild.roles.cache.find((role) => role.id === "998316966454505624");
				}
				if (string == "teal") {
					role = member.guild.roles.cache.find((role) => role.id === "998316971823206421");
				}
				if (string == "turquoise") {
					role = member.guild.roles.cache.find((role) => role.id === "998316981088440341");
				}
				if (string == "light-blue") {
					role = member.guild.roles.cache.find((role) => role.id === "998316992593412156");
				}
				if (string == "cyan") {
					role = member.guild.roles.cache.find((role) => role.id === "998316986650079312");
				}
				if (string == "blue") {
					role = member.guild.roles.cache.find((role) => role.id === "998317000117993542");
				}
				if (string == "dark-blue") {
					role = member.guild.roles.cache.find((role) => role.id === "998317005105008783");
				}
				if (string == "magenta") {
					role = member.guild.roles.cache.find((role) => role.id === "998317015334924471");
				}
				if (string == "fuchsia") {
					role = member.guild.roles.cache.find((role) => role.id === "998317021450223747");
				}
				if (string == "pink") {
					role = member.guild.roles.cache.find((role) => role.id === "998317010729570424");
				}
				if (string == "lavendar") {
					role = member.guild.roles.cache.find((role) => role.id === "998317027364175872");
				}
				if (string == "violet") {
					role = member.guild.roles.cache.find((role) => role.id === "998317032804200539");
				}
				if (string == "purple") {
					role = member.guild.roles.cache.find((role) => role.id === "998317040538497044");
				}

				member.roles.add(role);

				await interaction.reply(`You are now a citizen of \`${string}\`.`);
				console.log(`${member.displayName} is now a citizen of ${string}.`);
			} catch (error) {
				await interaction.reply({ content: "Something went wrong...", ephemeral: true });
				console.log(error);
			}
		} else {
			await interaction.reply({
				content: `\`${string}\` is not one of [The Square](https://pinniped.page/images/the-square.png)'s regions. Visit https://pinniped.page/projects/the-square for more information.`,
				ephemeral: true,
			});
		}
	}

	if (commandName === "leave") {
		try {
			const member = interaction.member;
			var role2;
			var region;
			var hasCitizenRole = false;

			if (member.roles.cache.has("998315343753789552")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998315343753789552");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "dark-red";
			}
			if (member.roles.cache.has("998314840785420309")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998314840785420309");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "red";
			}
			if (member.roles.cache.has("998315847288377455")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998315847288377455");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "orange";
			}
			if (member.roles.cache.has("998316318786854993")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316318786854993");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "dark-yellow";
			}
			if (member.roles.cache.has("998316074762256515")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316074762256515");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "yellow";
			}
			if (member.roles.cache.has("998317045684904038")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317045684904038");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "gold";
			}
			if (member.roles.cache.has("998316871122161784")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316871122161784");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "lime";
			}
			if (member.roles.cache.has("998316954253262939")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316954253262939");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "green";
			}
			if (member.roles.cache.has("998316961094176839")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316961094176839");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "dark-green";
			}
			if (member.roles.cache.has("998316966454505624")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316966454505624");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "olive";
			}
			if (member.roles.cache.has("998316971823206421")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316971823206421");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "teal";
			}
			if (member.roles.cache.has("998316981088440341")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316981088440341");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "turquoise";
			}
			if (member.roles.cache.has("998316992593412156")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316992593412156");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "light-blue";
			}
			if (member.roles.cache.has("998316986650079312")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998316986650079312");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "cyan";
			}
			if (member.roles.cache.has("998317000117993542")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317000117993542");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "blue";
			}
			if (member.roles.cache.has("998317005105008783")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317005105008783");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "dark-blue";
			}
			if (member.roles.cache.has("998317015334924471")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317015334924471");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "magenta";
			}
			if (member.roles.cache.has("998317021450223747")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317021450223747");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "fuchsia";
			}
			if (member.roles.cache.has("998317010729570424")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317010729570424");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "pink";
			}
			if (member.roles.cache.has("998317027364175872")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317027364175872");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "lavendar";
			}
			if (member.roles.cache.has("998317032804200539")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317032804200539");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "violet";
			}
			if (member.roles.cache.has("998317040538497044")) {
				role2 = member.guild.roles.cache.find((role2) => role2.id === "998317040538497044");
				member.roles.remove(role2);
				hasCitizenRole = true;
				region = "purple";
			}
			if (hasCitizenRole == false) {
				await interaction.reply({
					content: `You haven't joined one of [The Square](https://pinniped.page/images/the-square.png)'s regions and thus cannot leave one. Visit https://pinniped.page/projects/the-square for more information.`,
					ephemeral: true,
				});

				return;
			}

			await interaction.reply(`You are no longer a citizen of \`${region}\`.`);
			console.log(`${member.displayName} is no longer a citizen of ${region}.`);
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}

	if (commandName === "stop") {
		try {
			const user = interaction.member.user;

			if (user.id == "390612175137406978") {
				await interaction.reply({ content: "Stopping...", ephemeral: true });
				console.log(`${user.username} stopped the bot.`);

				process.exit(0);
			} else {
				await interaction.reply({ content: "Only Obsidian_Seal can use this command!", ephemeral: true });

				console.log(`${user.username} tried to stop the bot.`);
				const me = await client.users.fetch("390612175137406978");
				me.send(`**ALERT:** ${user} tried to use /stop.`);
			}
		} catch (error) {
			await interaction.reply({ content: "Something went wrong...", ephemeral: true });
			console.log(error);
		}
	}
});

client.login(token);
