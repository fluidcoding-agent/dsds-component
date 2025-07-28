#!/bin/bash
export STORYBOOK_BASE_URL=https://dsds.mwebdev.samsungds.net/storybooks/react-radix-ui
pnpm build:storybook
rm -rf /appdata/mwebdev/shared/www/storybooks/react-radix-ui
cp -rf storybook-static /appdata/mwebdev/shared/www/storybooks/react-radix-ui
