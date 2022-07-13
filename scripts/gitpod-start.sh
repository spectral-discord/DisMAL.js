#!/bin/bash

if [ ! -z "${NPM_TOKEN}" ] && [ ! -f "/workspace/DisMAL.js/.npmrc" ]; then
  printf "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}\n@spectral-discord:registry=https://npm.pkg.github.com" >> /workspace/DisMAL.js/.npmrc
fi