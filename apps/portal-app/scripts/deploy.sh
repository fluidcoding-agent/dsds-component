#!/bin/bash
cd /project/dsds/apps/portal-app/
pnpm build
pm2 restart ecosystem.config.js --env production
