import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execAsync = promisify(exec);

const sanitizeOutput = (value) => {
  if (!value) {
    return 'No output';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return 'No output';
  }
  return trimmed.slice(0, 1500);
};

const resolveRepoPath = () => {
  const repoPath =
    process.env.REPO_PATH && process.env.REPO_PATH.trim().length > 0
      ? process.env.REPO_PATH.trim()
      : process.cwd();

  return path.resolve(repoPath);
};

export const pullLatestFromRepo = async () => {
  const normalizedPath = resolveRepoPath();

  const { stdout, stderr } = await execAsync('git pull', {
    cwd: normalizedPath,
  });

  return {
    path: normalizedPath,
    stdout: sanitizeOutput(stdout),
    stderr: sanitizeOutput(stderr),
  };
};

const parseBehindCount = (statusOutput) => {
  const behindMatch = statusOutput.match(/behind (\d+)/);
  return behindMatch ? Number.parseInt(behindMatch[1], 10) : 0;
};

export const checkForRemoteUpdates = async () => {
  const normalizedPath = resolveRepoPath();

  const fetchResult = await execAsync('git fetch', {
    cwd: normalizedPath,
  });

  const statusResult = await execAsync('git status -sb', {
    cwd: normalizedPath,
  });

  const behindCount = parseBehindCount(statusResult.stdout ?? '');

  return {
    path: normalizedPath,
    fetch: {
      stdout: sanitizeOutput(fetchResult.stdout),
      stderr: sanitizeOutput(fetchResult.stderr),
    },
    status: {
      stdout: sanitizeOutput(statusResult.stdout),
      stderr: sanitizeOutput(statusResult.stderr),
      behindCount,
    },
    hasUpdates: behindCount > 0,
  };
};
