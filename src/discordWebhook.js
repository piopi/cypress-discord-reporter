require('dotenv').config()
const { Webhook, MessageBuilder } = require('discord-webhook-node');
async function sendWebhook(args) {

	const hook = new Webhook("https://discord.com/api/webhooks/814251630463549491/t1SwqowFgTDXHOUQhpfWE-N9jT_ny5bkrlevmQS9MmKSig9CIqRRUjWnUODsZlDPajRl");
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
