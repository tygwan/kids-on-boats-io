# 💻 Development Guide

This document outlines the architecture, development workflow, and coding standards for **Kids on Boats.io**.

## 🏗️ Architecture

The project follows a **Client-Server** architecture, split into two distinct applications within a monorepo structure.

```mermaid
graph TD
    User[Player] -->|HTTPS/WSS| Client[Frontend (Vercel)]
    Client -->|Socket.io| Server[Backend (Railway)]
    Server -->|Game State| Client
```

### Frontend (`/client`)
- **Framework**: React (Vite)
- **Styling**: CSS Modules / Vanilla CSS
- **Communication**: `socket.io-client`
- **Deployment**: Vercel (Static Site Hosting)

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: `socket.io`
- **Deployment**: Railway (Containerized Node.js Service)

## 🚀 Development Workflow

### Prerequisites
- Node.js v18+
- npm

### Setup
1. **Install Dependencies**:
   ```bash
   # Root directory
   npm install # (If root has package.json, otherwise install in subfolders)
   
   cd server && npm install
   cd client && npm install
   ```

2. **Running Locally**:
   You need two terminal instances.
   
   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   # Runs on http://localhost:3000
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   # Runs on http://localhost:5173
   ```

## 📁 Directory Structure

```
kids-on-boats-io/
├── client/                 # React Frontend
│   ├── public/             # Static assets (images, sounds)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── game/           # Game logic & Canvas rendering
│   │   ├── App.jsx         # Main entry component
│   │   └── main.jsx        # DOM entry point
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/                # (Optional) Source folder if logic grows
│   ├── server.js           # Entry point
│   └── package.json
├── docs/                   # Documentation
└── README.md               # Project Overview
```

## 🔌 API / Events (Socket.io)

### Client -> Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join_lobby` | `{ name: string }` | Player requests to join a lobby. |
| `row_stroke` | `{ type: 'left' \| 'right' }` | Player inputs a rowing stroke. |

### Server -> Client
| Event | Payload | Description |
|-------|---------|-------------|
| `lobby_update` | `{ players: [] }` | Updates the list of players in the lobby. |
| `game_state` | `{ boats: [{ id, progress, speed }] }` | Broadcasts current race positions. |

## 🎨 Code Style
- **Commits**: Use conventional commits (e.g., `feat: add boat rendering`, `fix: socket connection`).
- **Formatting**: Prettier default settings.
