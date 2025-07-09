import * as core from '@actions/core';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

function sanitize(name: string): string {
  // Replace illegal path chars with “_” and trim.
  const cleaned = name.replace(/[^a-z0-9 _.-]/gi, '_').trim();
  return cleaned.length > 0 ? cleaned : `untitled-${Date.now()}`;
}

async function run(): Promise<void> {
  try {
    // 1️⃣  Read and validate the input
    const userIdRaw = core.getInput('user_id', { required: true });
    const userId = Number(userIdRaw);
    if (!Number.isInteger(userId) || userId <= 0) {
      core.setFailed('`user_id` must be a positive integer.');
      return;
    }

    // 2️⃣  Fetch the user record
    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    core.info(`Fetching ${url} …`);
    const res = await fetch(url);
    if (!res.ok) {
      core.setFailed(`Request failed: HTTP ${res.status}`);
      return;
    }
    const data = (await res.json()) as Record<string, unknown>;

    // 3️⃣  Decide the directory name
    const dirName = typeof data.title === 'string'
      ? sanitize(data.title)
      : `placeholder-${uuid()}`;

    // 4️⃣  Create the directory inside GITHUB_WORKSPACE
    const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
    const dirPath = path.join(workspace, dirName);
    await fs.mkdir(dirPath, { recursive: true });
    core.info(`✅  Created directory: ${dirPath}`);

    // 5️⃣  Expose the result for downstream steps
    core.setOutput('created_dir', dirName);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

run();