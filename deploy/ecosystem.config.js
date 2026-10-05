// PM2 process manager config for the standalone Next.js server.
// This file is copied to the release root alongside server.js (see
// deploy/README.md's deploy steps) — it is NOT run from inside deploy/.
//
// Usage on the VPS (from /var/www/hammasir/current):
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup   # prints a systemd command to run once, so PM2 itself
//                 # survives a server reboot
//
// One instance only — the VPS has a single vCPU, so PM2 cluster mode would
// just add IPC overhead with no second core to actually use. PM2 here is
// for auto-restart on crash and clean start/stop/logs, not load balancing.
module.exports = {
  apps: [
    {
      name: "hammasir",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "700M", // restart before it threatens the 2GB box; tune after watching real usage
      autorestart: true,
      watch: false,
    },
  ],
};
