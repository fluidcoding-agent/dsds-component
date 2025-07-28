#!/bin/bash

# Start a temporary storybook dev server in the background
BROWSER=none ./node_modules/storybook/bin/index.cjs dev -p 56006 &
WEB_SERVER_PID=$!

# Set a trap to kill the web server on exit
trap "kill $WEB_SERVER_PID" EXIT

mkdir -p test-results
mkdir -p playwright-report
rm -rf test-results/*
rm -rf playwright-report/*
docker run --rm -i \
  -u $(id -u):$(id -g) \
  -e HOME=/root \
  -e PLAYWRIGHT_JSON_OUTPUT_NAME=playwright-report/results.json \
  -e TEST_BASE_URL='http://172.17.0.1:56006' \
  -e CI=true \
  -v ${PWD}/storybook-static:/app/storybook-static \
  -v ${PWD}/tests:/app/tests \
  -v ${PWD}/test-results:/app/test-results \
  -v ${PWD}/playwright-report:/app/playwright-report \
  -v ${PWD}/playwright.config.ts:/app/playwright.config.ts \
  playwright-runner pnpm playwright test --reporter html,json --retries=0 $1
