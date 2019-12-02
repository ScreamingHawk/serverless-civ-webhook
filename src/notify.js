'use strict';

const discordjs = require('discord.js')
const discord = new discordjs.Client()

// Map Civ game name to Discord channel Id
const games = {
	"Lovers": "478505976711086082",
	"Milky and Friends": "634070954963763201",
}

// Map Civ player name to Discord user Id
const players = {
	"MilkyTaste": "172630139878768640",
	"Superepicgecko": "190293274177699840",
	"SpicedEmpyreuma": "202101955231744000",
}

module.exports.notify = async event => {
	// Validate request
	console.debug(event.body)
	const data = JSON.parse(event.body)
	if (!data || !data.value1 || !data.value2){
		console.error('Invalid notify request')
		return {
			statusCode: 400,
		}
	}
	let gameName = data.value1
	let civPlayer = data.value2
	console.info(`Notifying ${civPlayer} of turn in game ${gameName}`)

	// Login to discord
	try {
		await discord.login(process.env.discordToken)
	} catch (err){
		console.error(`Discord login failed: ${err}`)
		console.log(`Token: ${process.env.discordToken}`)
		return {
			statusCode: 500,
		}
	}

	// Get channel
	let channelId = games[gameName] || process.env.defaultChannel
	const channel = discord.channels.get(channelId)
	if (!channel){
		console.error(`Invalid channel ${channelId}, using default`)
		channel = discord.channels.get(process.env.defaultChannel)
		if (!channel){
			// Fail default channel invalid
			console.error(`Invalid default channel ${process.env.defaultChannel}`)
			return {
				statusCode: 400,
			}
		}
	}

	// Get player
	let player = players[civPlayer]
	if (!player){
		console.warn(`Unable to find player with civName ${civPlayer}`)
		player = civPlayer
	} else {
		player = `<@${player}>`
	}

	// Send it
	console.debug('Sending notification')
	await channel.send(`Hey ${player}! It's your turn in Civ 6 game ${gameName}`)
	console.debug('Notification sent')

	// Logout of discord
	try {
		await discord.destroy()
	} catch (err){
		console.error(`Discord logout failed: ${err}`)
		// Fail over, still a success
	}

	return {
		statusCode: 200,
	}
}
