"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
function formatDirName(raw) {
    // lower-case
    let name = raw.toLowerCase();
    // compress whitespace → single underscore
    name = name.trim().replace(/\s+/g, '_');
    // remove anything that isn’t a-z, 0-9, underscore, dot, dash
    name = name.replace(/[^a-z0-9_.-]/g, '');
    // final check
    return name.length ? name : `untitled-${Date.now()}`;
}
async function run() {
    var _a;
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
        const data = (await res.json());
        // ---------------------------------------------------
        // Decide directory name
        // ---------------------------------------------------
        const dirName = typeof data.name === 'string'
            ? formatDirName(data.name)
            : `placeholder-${(0, uuid_1.v4)()}`;
        // ---------------------------------------------------
        // Create directory
        // ---------------------------------------------------
        const workspace = (_a = process.env.GITHUB_WORKSPACE) !== null && _a !== void 0 ? _a : process.cwd();
        const dirPath = path.join(workspace, dirName);
        await fs.mkdir(dirPath, { recursive: true });
        core.info(`✅  Created directory: ${dirPath}`);
        // ---------------------------------------------------
        // Output
        // ---------------------------------------------------
        core.setOutput('created_dir', dirName);
    }
    catch (err) {
        core.setFailed(err.message);
    }
}
run();
