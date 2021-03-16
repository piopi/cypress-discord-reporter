const { Status } = require('./status.js')
const { Color } = require('./colors.js')

async function compileResults(results){
	let title = ''
	let color = Color.BLACK
	let image
	let text = ''
	let testStats={
		totalTests : 0,
		passedTests : [],
		failedTests : [],
		brokenTests : [],
		skippedTests : []
	}
	
	if (!results) {
		console.warn('Report is empty')
		title = 'Test report is empty'
		color = Color.BLACK
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/error.png'
		text = 'An error has occured and the test report is empty.'
		
		return { testStats, color, title, image, text }
	}
	
	results['runs'].forEach(element => {
		
		const testsResults= element.tests;
		testStats.totalTests += testsResults.length
		testStats.passedTests=testStats.passedTests.concat(testsResults.filter(
		(testRes) => testRes.state === Status.PASSED
		));
		testStats.failedTests=testStats.failedTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.FAILED
		));
		testStats.brokenTests=testStats.brokenTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.BROKEN
		));
		testStats.skippedTests=testStats.skippedTests.concat(testsResults.filter(
			(testRes) => testRes.state === Status.SKIPPED
		))
		
	})
	
	if (testStats.failedTests.length > 0) {
		title = `${testStats.failedTests.length} test case(s) failed`
		color = Color.RED
		image = 'https://raw.githubusercontent.com/maritome/cypress-msteams-reporter/main/assets/images/failed.png'
		text = `**Failed test case(s):** \n ${testStats.failedTests
			.map((failedTest) => failedTest.title)
			.join('\n')} \n\n **Number of test cases that passed: **${testStats.passedTests.length}\n`
	} else if (testStats.brokenTests.length > 0) {
		title =
			testStats.brokenTests.length === 1
				? `${testStats.brokenTests.length} test case is broken`
				: `${testStats.brokenTests.length} test cases are broken`
		color = Color.YELLOW
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/failed.png'
		text = `Broken test case(s): \n ${testStats.brokenTests
			.map((brokenTest) => brokenTest.title)
			.join('\n')} \n\n **Number of test cases that passed: **${testStats.passedTests.length}\n`
	} else if (
		testStats.passedTests.length > 0 &&
		testStats.passedTests.length === testStats.totalTests - testStats.skippedTests.length
	) {
		title = 'All test cases passed'
		color = Color.GREEN
		text = `**Number of test cases that passed: **${testStats.passedTests.length}\n`
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/passed.png'
	} else {
		title = 'Unknown Status'
		color = Color.BLACK
		image = 'https://raw.githubusercontent.com/piopi/cypress-discord-reporter/main/assets/images/error.png'
		text =
			'Some of the tests have unknown status or the test results are missing.'
	}

	return { testStats, color, title, image, text, }
	
 }
module.exports = { compileResults }
