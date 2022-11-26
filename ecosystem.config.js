module.exports = {
  apps: [{
    // GENERAL
    name: "hexabot",
    script: "./node_modules/.bin/ts-node -r tsconfig-paths/register index.ts",
    // ADVANCED
    watch: true,
    // LOG FILES
    log_date_format: "DD-MM-YYYY HH:mm Z",
    error_file: "./pm2_errors/hexabot-error.log",
    time: true,
    // CONTROL FLOW
    min_uptime: 5000,
    autorestart: true
  }]
}