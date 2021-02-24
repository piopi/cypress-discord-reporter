#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { readAllureReport } = require('./allureReport')
const { sendWebhook } = require('./discordWebhook')

let version
try {
	const json = JSON.parse(
		fs.readFileSync(
			'./node_modules/cypress-discord-reporter/package.json',
			'utf8'
		)
	)
	version = json.version
} catch (error) {
	version = 'undefined'
}
program.version(version, '-v, --version')
program
	.option('--verbose', 'show log output')
	.option(
		'--report-path [type]',
		'define the path of allure report file',
		'./allure-report/widgets/status-chart.json'
	)
	.option(
		'--testEnv-path [type]',
		'define the path of allure report environment properties file',
		'./allure-report/widgets/environment.json'
	)
	.option('--report-url [type]', 'provide the link for the Test Report', '')
program.parse(process.argv)

const reportPath = program.reportPath
const testEnvPath = program.testEnvPath
const reportUrl = program.reportUrl
if (program.verbose) {
	console.log(
		`reportPath: ${reportPath}\n`,
		`testEnvironmentPropertiesFile: ${testEnvPath}\n`,
		`reportUrl: ${reportUrl}\n`
	)
}

;(async () => {
	let webhookArgs
	try {
		webhookArgs = await readAllureReport(reportPath, testEnvPath)
	} catch (error) {
		error.name
			? console.error(
					`${error.name}: ${error.message}`,
					'\nFailed to read the Allure report.'
			  )
			: console.error(
					'An unknown error occurred. Failed to read the Allure report.'
			  )
	}
	try {
		sendWebhook({ ...webhookArgs, reportUrl })
		console.log('Discord message was sent successfully.')
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
