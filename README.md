# 🚣 Kids on Boats.io

> "Aura Farming" on the river. A multiplayer rhythm racing game inspired by the viral [Indonesian Boat Racing Kid meme](https://knowyourmeme.com/memes/indonesian-boat-racing-kid-kid-aura-farming-on-boat).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange)

## 📖 About The Project

**Kids on Boats.io** is a real-time multiplayer web game where players work together (or compete) to row a traditional boat down a river. Success depends on perfect synchronization and rhythm, capturing the intense energy and "aura" of the viral meme.

### 🌟 Features
- **Real-time Multiplayer**: Race against other boats in real-time using Socket.io.
- **Rhythm Mechanics**: Press keys in sync with the beat to gain speed.
- **Meme Aesthetics**: Visuals inspired by the viral video, featuring the "Commander" kid.
- **Cross-Platform**: Playable in the browser on desktop and mobile.

## 🛠️ Tech Stack

This project is built as a monorepo with a split architecture for optimal deployment.

| Component | Technology | Deployment |
|-----------|------------|------------|
| **Frontend** | React, Vite, Canvas API | [Vercel](https://vercel.com) |
| **Backend** | Node.js, Express, Socket.io | [Railway](https://railway.app) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tygwan/kids-on-boats-io.git
   cd kids-on-boats-io
   ```

2. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Run Locally**
   - **Backend**: `cd server && npm run dev` (Default: Port 3000)
   - **Frontend**: `cd client && npm run dev` (Default: Port 5173)

## 🎮 How to Play
1. Enter your name and join a lobby.
2. Wait for the race to start.
3. Press the **Left** and **Right** arrow keys in time with the on-screen beat.
4. Maintain your rhythm to build "Aura" and speed up!

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
