'use strict';

const discordjs = require('discord.js')
const discord = new discordjs.Client()

module.exports.emoji = async event => {
	// Validate request
	console.debug(event.body)
	const data = JSON.parse(event.body)
	if (!data || !data.emoji || !data.channel){
		console.error('Invalid talk request')
		return {
			statusCode: 400,
		}
	}
	let emojiId = data.emoji
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
		// Fail channel invalid
		console.error(`Invalid channel ${channelId}`)
		return {
			statusCode: 400,
		}
	}

	// Get emoji
	const emoji = discord.emojis.find(e => e.name === emojiId)
	if (!emoji){
		console.error(`Invalid emoji ${emojiId}`)
		return {
			statusCode: 400,
		}
	}

	// Send it
	console.debug(`Sending ${emojiId}...`)
	await channel.send(`${emoji}`)
	console.debug('Emoji sent')

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
