const buildDisabledResult = () => ({
  path: process.cwd(),
  hasUpdates: false,
  repo: null,
  remoteCommit: null,
  localCommit: null,
  summary: 'Repository update checks are disabled.',
  compareUrl: null,
});

export const pullLatestFromRepo = async () => {
  const error = new Error('Repository update functionality is disabled.');
  error.code = 'UPDATES_DISABLED';
  throw error;
};

export const checkForRemoteUpdates = async () => buildDisabledResult();
