## Typescript Library Gitpod Starter
This repository contains some boilerplate for setting up a gitpod environment for developing typescript libraries that will be published as NPM packages.

What you get:
- Testing via Jest
- Linting via ESlint
- Lifecycle scripts & git hook for automated testing/linting
- Bundling via Rollup (cjs, es, & type definition bundles)
- CI via Github Actions
  - Testing for pushes to all branches
  - Compiling, bundling, and publishing to NPM when new package versions get pushed to main

### Getting started
To get going, just fork this project and open it in [Gitpod](https://www.gitpod.io/docs/getting-started).

The first time you start a Gitpod workspace for your new project:
- `yarn init` gets run automatically in the editor's built-in terminal.
- Provide some info about your project to the init prompts, or just use defaults and edit things later if needed.
- Then a script will install dependencies and modify your `package.json` to get everything set up so you can start coding right away.

### Publishing

For automated publishes via CI, you'll need to set your [npm token](https://docs.npmjs.com/creating-and-viewing-access-tokens) as a [secret](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-encrypted-secrets-for-your-repository-and-organization-for-github-codespaces) for your repository or organization.

If you'd like to publish manually, you can also set your npm token as an [environment variable](https://www.gitpod.io/docs/environment-variables) in Gitpod, and an `.npmrc` file will be generated during workspace startup.

### Make it your own

Want different configs for ESlint/Jest/Rollup/etc. - or entirely different dependencies? You can use this as a starting point for your own typescript library Gitpod starter.

Think something is missing from this repo? Feel free to create an issue or open a PR. I'd like to keep this pretty generic, but welcome improvements and ideas for other features.
