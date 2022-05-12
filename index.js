const core = require('@actions/core')
const github = require('@actions/github')

const createBranch = async (octokit, context, name) => {
  const ref = `refs/heads/${name}`
  const { repo, sha } = context

  const resp = await octokit.rest.git.createRef({
    ref,
    sha,
    owner: repo.owner,
    repo: repo.repo
  })

  return resp.data?.ref === ref
}

const run = async () => {
  try {
    const branchName = core.getInput('name')
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw ReferenceError('GITHUB_TOKEN was not provided')
    }

    const octokit = github.getOctokit(token)
    const { context } = github
    const created = await createBranch(octokit, context, branchName)
    core.setOutput('created', !!created)
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
