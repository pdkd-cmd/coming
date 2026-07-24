# Production deployment (Ubuntu 24.04 LTS)

This deployment runs the Express application with PM2 and exposes it through
Nginx. The application itself continues to serve the website, admin panel, API,
and uploads.

## Before you begin

- Clone this repository onto the Ubuntu server.
- Ensure the account running the commands can use `sudo`.
- Create the production environment file and set secure values:

  ```bash
  cp .env.production.example .env
  chmod 600 .env
  ```

  Set a long random `JWT_SECRET` and a strong `ADMIN_PASSWORD`. Keep `.env`,
  `uploads/`, and the SQLite database backed up; they contain production data.

## Initial setup

From the repository root, run:

```bash
bash deployment/setup.sh
```

The script installs required packages, configures Nginx, creates `uploads/`,
installs dependencies, starts PM2 as `pdkd`, and configures it to return after a
server restart. It makes this application's Nginx site the server's catch-all
HTTP site, replacing Ubuntu's default placeholder configuration.

Useful checks:

```bash
pm2 status
pm2 logs pdkd
sudo nginx -t
```

## Future deployment

After pulling changes to the server, run:

```bash
bash deployment/deploy.sh
```

It pulls the current branch, installs dependencies, restarts `pdkd`, and saves
the PM2 process list. Database and upload files are not changed by this script.

## Cloudflare Tunnel example

The example configuration is at `deployment/cloudflared.example.yml`. After
installing `cloudflared` and creating a tunnel in Cloudflare, copy it to
`/etc/cloudflared/config.yml`, replace `<TUNNEL_UUID>` and `<YOUR_HOSTNAME>`,
and place the generated tunnel credentials JSON at the configured path.

The tunnel forwards to Nginx on `localhost:80`; no domain is hardcoded in this
repository. Keep the final catch-all ingress rule so unmatched requests return
404.
