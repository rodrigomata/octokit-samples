require('dotenv').config();
const { Octokit } = require("octokit");

const {
  GITHUB_TOKEN = '',
  GITHUB_REPO = ''
} = process.env

const octokit = new Octokit({ auth: GITHUB_TOKEN });

(async function() {
  console.log('start');

  // :: Login
  const owner = await getAuthenticated()
  
  // :: Workflows
  const workflowRuns = await getWorkflows({ owner, repo: GITHUB_REPO, workflow_id: 'release.yml' })
  // const all = await getAllWorkflows({ owner, repo: GITHUB_REPO })
  // console.log('workflowRuns', workflowRuns)
  
  console.log('end');
})();

async function getAuthenticated() {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  return login;
}

async function getWorkflows({ owner, repo, workflow_id, branch = 'main' }) {
  const { data: { workflow_runs, total_count } } = await octokit
    .request(`GET /repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs`, {
      owner,
      repo,
      // branch,
      // workflow_id,
      event: 'release',
      status: 'success'
    })
  console.log({ total_count })
  return workflow_runs
}

async function getAllWorkflows({ owner, repo }) {
  const { data: { workflow_runs } } = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    event: 'release'
  });
  console.log('runs', JSON.stringify(workflow_runs[0], null, 2));
}