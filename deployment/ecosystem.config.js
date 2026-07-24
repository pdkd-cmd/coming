const path = require("path");

module.exports = {
  apps: [
    {
      name: "pdkd",
      script: "server/app.js",
      cwd: path.resolve(__dirname, ".."),
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
