const { Status } = require('./status.js')
const { Color } = require('./colors.js')

async function compileResults(results){
	let appName = ''
	let appVersion = ''
	let title = ''
	let color = Color.BLACK
	let image
	let text = ''
	let totalTests = 0
	let passedTests = []
		  ,failedTests = []
		  ,brokenTests = []
		  ,skippedTests = [];
	if (!results) {
		console.warn('Report is empty')
		title = 'Test report is empty'
		color = Color.BLACK
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/error.png'
		text = 'An error has occured and the test report is empty.'
		
		return { appName, appVersion, color, title, image, text 
		}
	}
	
	results['runs'].forEach(element => {
		
		const testsResults= element.tests;
		totalTests += testsResults.length
		passedTests=passedTests.concat(testsResults.filter(
		(testRes) => testRes.state === Status.PASSED
		));
		failedTests=failedTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.FAILED
		));
		brokenTests=brokenTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.BROKEN
		));
		skippedTests=skippedTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.SKIPPED
		))
		
	})
	
	if (failedTests.length > 0) {
		title = `${failedTests.length} test case(s) failed`
		color = Color.RED
		image = 'https://raw.githubusercontent.com/maritome/cypress-msteams-reporter/main/assets/images/failed.png'
		text = `**Failed test case(s):** \n ${failedTests
			.map((failedTest) => failedTest.title)
			.join('\n')} \n\n **Number of test cases that passed: **${passedTests.length}\n`
	} else if (brokenTests.length > 0) {
		title =
			brokenTests.length === 1
				? `${brokenTests.length} test case is broken`
				: `${brokenTests.length} test cases are broken`
		color = Color.YELLOW
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/failed.png'
		text = `Broken test case(s): \n ${brokenTests
			.map((brokenTest) => brokenTest.title)
			.join('\n')} \n\n **Number of test cases that passed: **${passedTests.length}\n`
	} else if (
		passedTests.length > 0 &&
		passedTests.length === totalTests - skippedTests.length
	) {
		title = 'All test cases passed'
		color = Color.GREEN
		text = `**Number of test cases that passed: **${passedTests.length}\n`
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/passed.png'
	} else {
		title = 'Unknown Status'
		color = Color.BLACK
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/error.png'
		text =
			'Some of the tests have unknown status or the test results are missing.'
	}

	return { appName, appVersion, color, title, image, text }
	
 }
module.exports = { compileResults }
