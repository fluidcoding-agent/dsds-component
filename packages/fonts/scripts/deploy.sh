#!/bin/bash
export STORYBOOK_BASE_URL=https://dsds.mwebdev.samsungds.net/storybooks/fonts
pnpm build:storybook
rm -rf /appdata/mwebdev/shared/www/storybooks/fonts
cp -rf storybook-static /appdata/mwebdev/shared/www/storybooks/fonts
