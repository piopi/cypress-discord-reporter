require('dotenv').config()
const { Webhook, MessageBuilder } = require('discord-webhook-node');
async function sendWebhook(args) {

	let hook 
	if(args.webHook){
		hook=new Webhook(args.webHook);
	}
	else if(process.env.DISCORD_WEBHOOK_URL){
		hook=new Webhook(process.env.DISCORD_WEBHOOK_URL);
	}
	else{
		
		throw new Error('Failed to send Discord message. Please enter the the Discord webhook url either with the argument --discordHook or in the .env file');
	  
	}
	const embed = new MessageBuilder();

	await embed.setTitle(args.title)
			    .setColor(args.color)
				
				.setThumbnail(args.image)
				.setTimestamp();
	if(args.url){
		await embed.addField('Report URL:', args.url);
	}
	if(args.appName){
		await embed.setDescription(`**Application:** ${args.appName} \n\n`+args.text);
	}else{
		await embed.setDescription(args.text);
	}

			
	hook.send(embed);
}
module.exports = { sendWebhook }
