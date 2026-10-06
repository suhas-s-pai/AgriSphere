# AgriSphere - Local Setup & Installation Guide

Follow these steps to initialize and run AgriSphere on a local developer machine:

## 1. Environment Preparation
Ensure you have Node.js (v18+) installed.

## 2. Dependencies Installation
From project root:
```bash
npm run install:all
```

## 3. Launching Applications

### Run Both Concurrently
```bash
npm run dev
```

### Run Frontend Only
```bash
npm run client
```

### Run Backend Only
```bash
npm run server
```

## 4. Verification
- Open `http://localhost:5173` to view the AgriSphere dashboard.
- Verify `Farmer.png` loads in the hero banner.
- Open `http://localhost:5000/api/v1/health` to confirm Express API startup.

