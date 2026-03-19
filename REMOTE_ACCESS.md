# Remote Access Guide

## Overview

This document explains how to access the taskflow web app from another host on the same local network.

## Server Configuration

The dev server is configured to bind to `0.0.0.0` on port `5173`, making it accessible from other devices on your local network.

## Accessing from Another Host

### On the Host Machine (where the server runs)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. The server will start on `http://0.0.0.0:5173`

### On Another Host (different IP on same network)

1. Find the IP address of the host machine running the dev server:
   ```bash
   # Linux/macOS
   ip addr show | grep inet
   
   # Windows
   ipconfig
   ```

2. On the other host, open a browser and navigate to:
   ```
   http://<host-ip>:5173
   ```
   
   Example: `http://192.168.1.100:5173`

## Firewall/Port Considerations

### Linux (ufw)

If using UFW firewall, allow port 5173:
```bash
sudo ufw allow 5173
```

### macOS

macOS typically doesn't block incoming connections by default. If you see a firewall prompt, allow the connection.

### Windows

Windows Firewall may prompt when first running the dev server. Allow the connection for private networks.

## Security Considerations

⚠️ **Important**: This configuration is for **local development only**.

- The server is not protected by authentication
- No HTTPS is configured
- The app is only intended for local network use
- Do NOT expose this to the internet

For production deployments, use a proper reverse proxy (nginx, Caddy) with SSL/TLS and authentication.

## Troubleshooting

### Can't connect from another host

1. Verify the server is running on `0.0.0.0:5173` (not `127.0.0.1`)
2. Check the host machine's IP address with `ip addr` or `ipconfig`
3. Verify no firewall is blocking port 5173
4. Ensure both hosts are on the same network

### Connection refused

1. Check if the dev server is still running
2. Verify the IP address is correct
3. Try pinging the host machine: `ping <host-ip>`

### Wrong page / 404

1. Ensure you're accessing `http://<host-ip>:5173` (not just the IP)
2. Check that the dev server shows "Local: http://0.0.0.0:5173" in the output
