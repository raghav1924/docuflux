# Deployment & Production Operations — DocuFlux

**Target:** Architecture Visualizer & Dependency Graph Generator  
**Author:** Jatin Sharma ([https://jatinsh.netlify.app/](https://jatinsh.netlify.app/))

---

## 1. Container Deployment (Docker)

```bash
docker build -t docuflux:latest .
docker run -d -p 4040:4040 --name docuflux docuflux:latest
```

## 2. Process Manager (PM2)

```bash
npm install -g pm2
pm2 start dist/bin.js --name "docuflux" -- studio --port 4040
```

## 3. Systemd Service Unit

```ini
[Unit]
Description=DocuFlux Background Service
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/docuflux
ExecStart=/usr/bin/node dist/bin.js studio --port 4040
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
