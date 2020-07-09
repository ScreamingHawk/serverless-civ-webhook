'use strict';

const discordjs = require('discord.js')
const discord = new discordjs.Client()

const defaultChannel = process.env.defaultChannel || "478506811238907904"

// Map Civ game name to Discord channel Id
const games = {
	"INTJ": "655923289662685194",
	"Quarantinos": "694374244125245511",
	"Moist_Cat": "704256661635727430",
	"Age of Covid": "718338274850242630",
	"Lovers": "709183529971613716",
}

// Games that should not notify
const suppressedGames = [
	"game-",
]

// Map Civ player name to Discord user Id
const players = {
	"MilkyTaste": "172630139878768640",
	"Diego Brando": "190293274177699840",
	"IcedEmpyre": "202101955231744000",
	"naguyin": "234439528473952257",
	"Tundra": "163056566285762562",
	"misskatles": "692469523063898144",
	"Atomic_Kiwi": "280986022131531777",
	"TurtlePoke": "596994824951824393",
	"Legofir": "160913311645433856",
	"Tagswell": "139541918836195329",
	"Katrominic": "496281027518398464",
}

const findInPrefixList = (list, value) => {
	return list.filter(i => value.startsWith(i))[0]
}
const findInPrefixMap = (map, value) => {
	const key = findInPrefixList(Object.keys(map), value)
	return map[key]
}

module.exports.notify = async event => {
	// Validate request
	console.debug(event.body)
	const data = JSON.parse(event.body)
	if (!data || !data.value1 || !data.value2) {
		console.error('Invalid notify request')
		return {
			statusCode: 400,
		}
	}
	let gameName = data.value1
	let civPlayer = data.value2

	if (findInPrefixList(suppressedGames, gameName)) {
		console.info(`Suppressing notification of game ${gameName}`)
		return {
			statusCode: 200,
		}
	}
	console.info(`Notifying ${civPlayer} of turn in game ${gameName}`)

	// Login to discord
	try {
		await discord.login(process.env.discordToken)
	} catch (err) {
		console.error(`Discord login failed: ${err}`)
		console.log(`Token: ${process.env.discordToken}`)
		return {
			statusCode: 500,
		}
	}

	// Get channel exact, no number suffix, or default
	let channelId = findInPrefixMap(games, gameName) || defaultChannel
	const channel = discord.channels.get(channelId)
	if (!channel) {
		console.error(`Invalid channel ${channelId}, using default`)
		channel = discord.channels.get(process.env.defaultChannel)
		if (!channel) {
			// Fail default channel invalid
			console.error(`Invalid default channel ${defaultChannel}`)
			return {
				statusCode: 400,
			}
		}
	}

	// Get player
	let player = players[civPlayer]
	if (!player) {
		console.warn(`Unable to find player with civName ${civPlayer}`)
		player = civPlayer
	} else {
		player = `<@${player}>`
	}

	// Send it
	console.debug('Sending notification')
	await channel.send(`It's ${player}'s turn to play ${gameName}`)
	console.debug('Notification sent')

	// Logout of discord
	try {
		await discord.destroy()
	} catch (err) {
		console.error(`Discord logout failed: ${err}`)
		// Fail over, still a success
	}

	return {
		statusCode: 200,
	}
}
