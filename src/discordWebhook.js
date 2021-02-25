require('dotenv').config()
const { Webhook, MessageBuilder } = require('discord-webhook-node');
async function sendWebhook(args) {

	const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);
	const embed = new MessageBuilder();
	//console.log(args.image);

	await embed.setTitle(args.title)
			    .setColor(args.color)
				.addField('Summary', 'E2E Tests')
				.setDescription(args.text)
				.setThumbnail(args.image);

			
	hook.send(embed);
}
module.exports = { sendWebhook }
