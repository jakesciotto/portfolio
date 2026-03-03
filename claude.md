## Project Context

This is my portfolio site. My sense of humor is captured in my long Twitter career, backed up in /public/tweets.js. My site is mainly for fun, but it will showcase how I can blend humor and technical skill all in one.

## Rules

1. Do not ever publish passwords, API keys, or tokens to git/npm/docker.
2. Under no circumstance should a commit be made without explicit approval OR verification that no secrets are included.
3. Never commit `.env` to git, always verify `.env` is in `.gitignore`.

## Code Style

1. Under no circumstance should an emoji ever appear in a commit messasge, comment, or planning document.
2. Use of [Semantic Versioning](https://semver.org/) in release tags is required.
   a. Given a version number in the format &#8212; MAJOR.MINOR.PATCH, increment the:
   1. MAJOR version when you make incompatible API changes.
   2. MINOR version when you add functionality in a backward compatible manner.
   3. PATCH version when you make backward compatible bug fixes.
3. Unless given explicit approval, do not create extra files in temporary directories for the purpose of scripting or testing.