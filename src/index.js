#!/usr/bin/env node

const cypress = require('cypress')

const { compileResults } = require('./compileResults')
const { sendWebhook } = require('./discordWebhook')
let url,appName,webHook;
let sendOnFail=false;
let cypressArg=processCliArg(process.argv.slice(2));

function processCliArg(argv){
	let filteredArg=argv;
	if(argv.indexOf("--help")>-1 || argv.indexOf("-h")>-1 || argv.indexOf("-help")>-1){
		console.log("Usage: index.js [options] \n\nOptions:\n  --reportUrl   provide the link for the Report (default: '')\n  --appName     define the App Name for the report(default: '')\n  --discordHook provide the link for the discord hook\n  --onFail      send report only when it contains failures\n  -h,--help     display help for command");
		process.exit(0);
	}
	if(argv.indexOf("--reportUrl")>-1 || argv.indexOf("--appName")>-1 || argv.indexOf("--discordHook")>-1 || argv.indexOf("--onFail")>-1){
		url=argv.indexOf("--reportUrl")>-1 ? argv[argv.indexOf("--reportUrl")+1]:"";
		appName= argv.indexOf("--appName")>-1 ? argv[argv.indexOf("--appName")+1]:"";
		webHook= argv.indexOf("--discordHook")>-1 ? argv[argv.indexOf("--discordHook")+1]:"";
		sendOnFail= argv.indexOf("--onFail")>-1;
		filteredArg= argv.filter( value => { 
			return value != url && value != '--reportUrl' && value != appName && value != webHook && value !="--discordHook" && value != "--appName" && value !="--onFail";
		});
	}
	
	
	return filteredArg;
		
	
}
(async () => {
	let summary;
	try {
	const runOptions = await cypress.cli.parseRunArguments(cypressArg);
	const results = await cypress.run(runOptions);
	summary= await compileResults(results);
	
	} catch (error) {
		error.name
		? console.error(
				`${error.name}: ${error.message}`,
				'\nFailed to send Discord message.'
		  )
		: console.error(
				'An unknown error occurred. Failed to send Discord message.'
		  )
	}
	try {
		if(!sendOnFail || sendOnFail && summary.testStats.failedTests.length !== 0){
		await sendWebhook({ ...summary, url, appName,webHook});
		console.log('Discord message was sent successfully.');
		}else{
			console.log('All tests passed but the report was not sent because of the option --onFail');
		}
		
		 
	} catch (error) {
		error.name
			? console.error(
					`${error.name}: ${error.message}`,
					'\nFailed to send Discord message.'
			  )
			: console.error(
					'An unknown error occurred. Failed to send Discord message.'
			  )
	}
	})()
 

