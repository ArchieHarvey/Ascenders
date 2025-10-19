import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import AdmZip from 'adm-zip';

const METADATA_FILENAME = '.update-metadata.json';
const DEFAULT_PRESERVE = ['node_modules', '.env', METADATA_FILENAME];

const toNonEmptyString = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const resolveRepoPath = () => {
  const repoPath = toNonEmptyString(process.env.REPO_PATH) ?? process.cwd();
  return path.resolve(repoPath);
};

const resolveRepoConfig = () => {
  const slug = toNonEmptyString(process.env.UPDATE_REPO_SLUG);
  let owner = null;
  let repo = null;

  if (slug) {
    const parts = slug.split('/');
    if (parts.length === 2) {
      [owner, repo] = parts;
    } else {
      throw new Error(
        `Invalid UPDATE_REPO_SLUG value "${slug}". Expected format "owner/repo".`,
      );
    }
  } else {
    owner = toNonEmptyString(process.env.UPDATE_REPO_OWNER);
    repo = toNonEmptyString(process.env.UPDATE_REPO_NAME);
  }

  if (!owner || !repo) {
    throw new Error(
      'Repository information missing. Set UPDATE_REPO_SLUG or UPDATE_REPO_OWNER and UPDATE_REPO_NAME.',
    );
  }

  const ref = toNonEmptyString(process.env.UPDATE_REPO_REF) ?? 'main';
  const token =
    toNonEmptyString(process.env.GITHUB_TOKEN) ??
    toNonEmptyString(process.env.UPDATE_REPO_TOKEN) ??
    null;

  return {
    owner,
    repo,
    ref,
    token,
    fullName: `${owner}/${repo}`,
  };
};

const resolvePreserveSet = () => {
  const extra = toNonEmptyString(process.env.UPDATE_PRESERVE_PATHS);
  const preserve = new Set(DEFAULT_PRESERVE);

  if (extra) {
    extra
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => preserve.add(item));
  }

  return preserve;
};

const metadataPathFor = (repoPath) => path.join(repoPath, METADATA_FILENAME);

const readMetadata = async (repoPath) => {
  const metadataPath = metadataPathFor(repoPath);
  try {
    const raw = await fs.readFile(metadataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      commitSha: toNonEmptyString(parsed.commitSha),
      lastCheckedAt: toNonEmptyString(parsed.lastCheckedAt),
    };
  } catch (error) {
    return { commitSha: null, lastCheckedAt: null };
  }
};

const writeMetadata = async (repoPath, metadata) => {
  const metadataPath = metadataPathFor(repoPath);
  const payload = JSON.stringify(
    {
      ...metadata,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );
  await fs.writeFile(metadataPath, payload, 'utf8');
};

const githubHeaders = (token, accept = 'application/vnd.github+json') => {
  const headers = {
    Accept: accept,
    'User-Agent': 'ascenders-discord-bot/1.0',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const fetchJson = async (url, token) => {
  const response = await fetch(url, {
    headers: githubHeaders(token),
  });

  if (!response.ok) {
    const message = `GitHub request failed (${response.status} ${response.statusText})`;
    const error = new Error(message);
    error.status = response.status;
    error.statusText = response.statusText;
    error.url = url;
    throw error;
  }

  return response.json();
};

const fetchLatestCommitInfo = async (config) => {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/commits/${config.ref}`;

  const payload = await fetchJson(url, config.token);

  return {
    sha: toNonEmptyString(payload.sha),
    htmlUrl: toNonEmptyString(payload.html_url),
    message: toNonEmptyString(payload.commit?.message) ?? 'No commit message',
    authorName: toNonEmptyString(payload.commit?.author?.name),
    authorEmail: toNonEmptyString(payload.commit?.author?.email),
    committedAt:
      toNonEmptyString(payload.commit?.committer?.date) ??
      toNonEmptyString(payload.commit?.author?.date) ??
      null,
    zipballUrl: toNonEmptyString(payload.zipball_url),
  };
};

const downloadZipArchive = async (url, token) => {
  const response = await fetch(url, {
    headers: githubHeaders(token, 'application/octet-stream'),
  });

  if (!response.ok) {
    const message = `Failed to download repository archive (${response.status} ${response.statusText})`;
    const error = new Error(message);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const shouldPreserve = (relativePath, preserveSet) => {
  const [firstSegment] = relativePath.split(path.sep);
  return preserveSet.has(firstSegment);
};

const cleanTargetDirectory = async (targetDir, preserveSet) => {
  let removedCount = 0;
  const entries = await fs.readdir(targetDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (shouldPreserve(entry.name, preserveSet)) {
        return;
      }

      const targetPath = path.join(targetDir, entry.name);
      await fs.rm(targetPath, { recursive: true, force: true });
      removedCount += 1;
    }),
  );

  return removedCount;
};

const copyDirectoryContents = async (
  sourceDir,
  destinationDir,
  preserveSet,
  relativeBase = '',
) => {
  let filesWritten = 0;
  let directoriesCreated = 0;

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destinationDir, entry.name);
    const relativePath = relativeBase
      ? path.join(relativeBase, entry.name)
      : entry.name;

    if (shouldPreserve(relativePath, preserveSet)) {
      continue;
    }

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      directoriesCreated += 1;
      const childStats = await copyDirectoryContents(
        sourcePath,
        destPath,
        preserveSet,
        relativePath,
      );
      filesWritten += childStats.filesWritten;
      directoriesCreated += childStats.directoriesCreated;
      continue;
    }

    if (entry.isFile()) {
      await fs.copyFile(sourcePath, destPath);
      filesWritten += 1;
      continue;
    }
  }

  return { filesWritten, directoriesCreated };
};

const extractZipToTemp = async (archiveBuffer) => {
  const tempRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), 'ascenders-update-'),
  );
  const zip = new AdmZip(archiveBuffer);
  zip.extractAllTo(tempRoot, true);

  const extracted = await fs.readdir(tempRoot);
  if (extracted.length === 0) {
    throw new Error('Repository archive was empty.');
  }

  return {
    tempDir: tempRoot,
    extractedRoot: path.join(tempRoot, extracted[0]),
  };
};

const buildCompareUrl = (config, localSha, remoteSha) => {
  if (!localSha || !remoteSha || localSha === remoteSha) {
    return null;
  }
  return `https://github.com/${config.owner}/${config.repo}/compare/${localSha}...${remoteSha}`;
};

export const pullLatestFromRepo = async () => {
  const repoPath = resolveRepoPath();
  const config = resolveRepoConfig();
  const preserveSet = resolvePreserveSet();
  const previousMetadata = await readMetadata(repoPath);

  const commitInfo = await fetchLatestCommitInfo(config);

  if (!commitInfo.sha || !commitInfo.zipballUrl) {
    throw new Error('Unable to resolve commit information from GitHub.');
  }

  const archiveBuffer = await downloadZipArchive(
    commitInfo.zipballUrl,
    config.token,
  );

  const { tempDir, extractedRoot } = await extractZipToTemp(archiveBuffer);

  await fs.mkdir(repoPath, { recursive: true });
  const removedEntries = await cleanTargetDirectory(repoPath, preserveSet);

  const { filesWritten, directoriesCreated } = await copyDirectoryContents(
    extractedRoot,
    repoPath,
    preserveSet,
  );

  await writeMetadata(repoPath, { commitSha: commitInfo.sha });

  await fs.rm(tempDir, { recursive: true, force: true });

  return {
    path: repoPath,
    repo: {
      owner: config.owner,
      name: config.repo,
      ref: config.ref,
      fullName: config.fullName,
    },
    commit: commitInfo,
    previousCommit: previousMetadata.commitSha,
    filesWritten,
    directoriesCreated,
    removedEntries,
    preserved: Array.from(preserveSet),
    compareUrl: buildCompareUrl(
      config,
      previousMetadata.commitSha,
      commitInfo.sha,
    ),
  };
};

export const checkForRemoteUpdates = async () => {
  const repoPath = resolveRepoPath();
  const config = resolveRepoConfig();
  const localMetadata = await readMetadata(repoPath);
  const commitInfo = await fetchLatestCommitInfo(config);

  const hasUpdates =
    !!commitInfo.sha && commitInfo.sha !== localMetadata.commitSha;

  const compareUrl = buildCompareUrl(
    config,
    localMetadata.commitSha,
    commitInfo.sha,
  );

  const summaryLines = [
    `Repository: \`${config.fullName}\``,
    `Branch/Ref: \`${config.ref}\``,
    `Latest commit: \`${commitInfo.sha ?? 'unknown'}\``,
    commitInfo.message ? `Message: ${commitInfo.message}` : null,
    hasUpdates
      ? `Update required: remote commit differs from local metadata (${localMetadata.commitSha ?? 'unknown'})`
      : 'Local copy already matches the latest commit.',
    compareUrl ? `Compare changes: ${compareUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    path: repoPath,
    repo: {
      owner: config.owner,
      name: config.repo,
      ref: config.ref,
      fullName: config.fullName,
    },
    remoteCommit: commitInfo,
    localCommit: localMetadata.commitSha,
    hasUpdates,
    summary: summaryLines,
    compareUrl,
  };
};
