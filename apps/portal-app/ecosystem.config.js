module.exports = {
  apps: [
    {
      name: "dsds-portal",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 63210",
      cwd: "/project/dsds/apps/portal-app",
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        NEXT_TELEMETRY_DISABLED: 1,
      },
      env_production: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: 1,
        PORT: 64321,
      },
    },
  ],
};
