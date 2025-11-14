# Replit Deployment Notes

This project has been configured to run on Replit (instead of Vercel).

## What changed
- Deployment platform: **Replit**
- Dev server and preview now bind to `0.0.0.0` and use port `5000`.
- HMR client port is configured to `443` to work through Replit's HTTPS proxy.

## Vite configuration
The following settings were added to `vite.config.js`:

- `server`:
  - `host: '0.0.0.0'` — Bind to all network interfaces.
  - `port: 5000` — Replit's required port for web preview.
  - `strictPort: true` — Fail if the port is unavailable.
  - `allowedHosts: true` — Accept Replit's dynamic proxy domains.
  - `hmr.clientPort: 443` — Ensure HMR works through Replit's HTTPS proxy.

- `preview`:
  - `host: '0.0.0.0'`
  - `port: 5000`
  - `strictPort: true`

## Package scripts
Updated `package.json` scripts:

- `dev`: `vite --host 0.0.0.0 --port 5000`
- `preview`: `vite preview --host 0.0.0.0 --port 5000`

## Build & Run (Replit)
- Build: `npm run build`
- Start preview: `npm run preview`

## HMR (Hot Module Reload) Notes
Replit serves your project through an HTTPS proxy. To ensure HMR connects reliably:
- Use `hmr.clientPort: 443` in Vite config so the client connects over the proxy's HTTPS port.

## Removed files
- `vercel.json` was removed since it is not needed for Replit deployments.

## Replit-managed configuration (informational)
Replit can manage invisible configuration for:
- Autoscale deployments (build: `npm run build`, start: `npm run preview`)
- Workflows (e.g., a `dev` workflow that runs `npm run dev` and exposes webview on port 5000)

If you want, I can add a short `replit.nix` or `.replit` file to further instruct Replit on how to run the app.
