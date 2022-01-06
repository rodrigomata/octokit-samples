const { Octokit } = require("octokit");

(function() {
  console.log('start');
  const octokit = new Octokit({ auth: `personal-access-token123` });
})();