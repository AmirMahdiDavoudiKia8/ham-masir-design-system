// PM2 config for the ad-commenter — deployed once to the VPS (not rebuilt
// on every site release, same as bots/ecosystem.config.js).
module.exports = {
  apps: [
    {
      name: "ad-commenter",
      script: "ad_commenter.py",
      interpreter: "python3",
      cwd: __dirname,
      max_memory_restart: "150M",
    },
  ],
};
