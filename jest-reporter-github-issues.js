const Octokit = require('@octokit/rest').Octokit

const { env: { GH_SYNTH_TOKEN, ISSUE_TITLE } } = process
const octokit = new Octokit({ auth: GH_SYNTH_TOKEN })

const labels = ['api', 'critical']

class GHIssueReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
    if (!GH_SYNTH_TOKEN) {
      throw new Error('A GitHub token with full repo permission must be available as the environment variable "GH_SYNTH_TOKEN"')
    }
  }

  formatMarkdown(errors) {
    return `
Unexpected interactions with API endpoint caught during synthetic testing.\n
The following tests have failed:\n
${errors.map(({ title }) => `\t🚫 ${title}\n`).join('')}\n
Please fix the API or the tests ASAP
`
  }

  async onRunComplete(contexts, results) {
    let failedTests = []

    for (apiTestResults of results.testResults) {
      const currentFailedTests = apiTestResults.testResults.filter(({ status }) => status === 'failed')
      failedTests = [...failedTests, ...currentFailedTests]
    }

    if (!failedTests.length) {
      console.log('\nAnother day, another dollar 👍')
      return
    }
    const body = this.formatMarkdown(failedTests)
    try {
      const { data } = await octokit.issues
        .create({
          owner: 'github-name-of-owner',
          repo: 'repo-name',
          title: ISSUE_TITLE,
          labels,
          body,
          assignees: ['your-github-name']
        })
      console.error(`Issue raised on Github (${data.html_url})`)
    } catch (e) {
      console.error(`Github error : ${JSON.stringify(e)}`)
    }
  }
}

module.exports = GHIssueReporter
