# 🗂️ Create user directory from JSONPlaceholder

Fetch a user profile from the free **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** API and automatically create a folder named after the user’s `name` field (or a random, human-readable fallback). Ideal for demos, onboarding workshops, and CI/CD test scaffolding.

![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-Create%20user%20directory%20from%20JSONPlaceholder-orange?logo=github&style=flat)
![Runs on Node 20](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)

---

## Table&nbsp;of&nbsp;Contents

  - [Features](#features)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Example usage](#example-usage)

---

## Features

| ✅ | Capability |
|----|------------|
| ✔️ | Fetch any `/users/{id}` record from JSONPlaceholder |
| ✔️ | Creates a folder **in the workspace** named after the user’s `name` |
| ✔️ | **Random fallback** name when the user record is missing or `name` is empty |
| ✔️ | Exposes the folder name via an **output** for downstream steps |
| ✔️ | Written in TypeScript → bundled JS (`dist/index.js`) for Node 20 runtime |

---

## Inputs

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `user_id` | **Yes** | `1` | Integer ID of the `/users/{id}` record to fetch |

---

## Outputs

| Name | Description |
|------|-------------|
| `created_dir` | The name of the directory created inside the workspace |

---

## Example usage

```yaml
name: Demo JSONPlaceholder directory
on:
  push:
    branches: [ main ]

jobs:
  demo:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Create user directory
        id: userdir
        # Pin to a specific commit or version tag in production!
        uses: Safarveisi/custom-github-action@v1
        with:
          user_id: 7

      - name: Output directory name
        run: echo "👋 Created ${{ steps.userdir.outputs.created_dir }}"
