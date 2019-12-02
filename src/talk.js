'use strict';

const discordjs = require('discord.js')
const discord = new discordjs.Client()

module.exports.talk = async event => {
	// Validate request
	console.debug(event.body)
	const data = JSON.parse(event.body)
	if (!data || !data.content || !data.channel){
		console.error('Invalid talk request')
		return {
			statusCode: 400,
		}
	}
	let content = data.content
	let channelId = data.channel

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
	const channel = discord.channels.get(channelId)
	if (!channel){
		// Fail default channel invalid
		console.error(`Invalid channel ${channelId}, using default`)
		return {
			statusCode: 400,
		}
	}

	// Send it
	console.debug(`Sending ${content}...`)
	await channel.send(content)
	console.debug('Content sent')

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