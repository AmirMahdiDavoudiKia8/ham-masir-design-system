// PM2 config for both payment bots — deployed once to the VPS (not rebuilt
// on every site release, unlike the main app), each its own process so one
// crashing doesn't take the other down.
module.exports = {
  apps: [
    {
      name: "hammasir-bot-telegram",
      script: "telegram-bot.js",
      cwd: __dirname,
      interpreter_args: "--env-file=.env",
      max_memory_restart: "150M",
    },
    {
      name: "hammasir-bot-bale",
      script: "bale-bot.js",
      cwd: __dirname,
      interpreter_args: "--env-file=.env",
      max_memory_restart: "150M",
    },
  ],
};
