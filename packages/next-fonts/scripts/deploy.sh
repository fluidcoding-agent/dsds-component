#!/bin/bash
export STORYBOOK_BASE_URL=https://dsds.mwebdev.samsungds.net/storybooks/tokens
pnpm build:storybook
rm -rf /appdata/mwebdev/shared/www/storybooks/tokens
cp -rf storybook-static /appdata/mwebdev/shared/www/storybooks/tokens
