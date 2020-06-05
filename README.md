# Serverless Civ Webhook

A serverless webhook to notify when it is your turn in a Civilization VI play by cloud game

## Set up

Install [serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/).
Configure your [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
Create a [discord bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html##creating-your-bot).

Copy the example environment variables file.

```sh
cp env.example .env
```

Modify the values in the `.env` file with your values where:
* `DISCORD_TOKEN` is your discord bot's token
* `DEFAULT_CHANNEL` is the default channel id for your notifications

## Deployment

```sh
serverless deploy --aws-profile default
```

### Test

Notification

```sh
sls invoke -f notify --aws-profile default --path test/civ.example.json
```

### Logs

```sh
sls logs -f notify --aws-profile default
```

## Test locally

Replace `XXX` with your env values.

```sh
sls invoke local -f notify --path test/civ.example.json -e discordToken=XXX -e defaultChannel=XXX
```

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT License](https://tldrlegal.com/license/mit-license) so it's free to use so long as you give me credit.