#!/bin/bash
. .env.local
cd /project/dsds/apps/portal-app/
pm2 delete dsds-portal > /dev/null
pm2 start ecosystem.config.js --env production

