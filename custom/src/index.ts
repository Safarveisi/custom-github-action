import * as core from '@actions/core';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

function formatDirName(raw: string): string {
  // lower-case
  let name = raw.toLowerCase();

  // compress whitespace → single underscore
  name = name.trim().replace(/\s+/g, '_');

  // remove anything that isn’t a-z, 0-9, underscore, dot, dash
  name = name.replace(/[^a-z0-9_.-]/g, '');

  // final check
  return name.length ? name : `untitled-${Date.now()}`;
}

async function run(): Promise<void> {
  try {
    // ---------------------------------------------------
    // Input
    // ---------------------------------------------------
    const userIdRaw = core.getInput('user_id', { required: true });
    const userId = Number(userIdRaw);
    if (!Number.isInteger(userId) || userId <= 0) {
      core.setFailed('`user_id` must be a positive integer.');
      return;
    }

    // ---------------------------------------------------
    // Fetch the record
    // ---------------------------------------------------
    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    core.info(`Fetching ${url} …`);
    const res = await fetch(url);
    if (!res.ok) {
      core.setFailed(`Request failed: HTTP ${res.status}`);
      return;
    }
    const data = (await res.json()) as Record<string, unknown>;

    // ---------------------------------------------------
    // Decide directory name
    // ---------------------------------------------------
    const dirName =
      typeof data.name === 'string'
        ? formatDirName(data.name)
        : `placeholder-${uuid()}`;

    // ---------------------------------------------------
    // Create directory
    // ---------------------------------------------------
    const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
    const dirPath = path.join(workspace, dirName);
    await fs.mkdir(dirPath, { recursive: true });
    core.info(`✅  Created directory: ${dirPath}`);

    // ---------------------------------------------------
    // Output
    // ---------------------------------------------------
    core.setOutput('created_dir', dirName);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

run();