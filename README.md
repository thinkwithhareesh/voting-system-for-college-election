# Mohamed Sathak Engineering College Kilakarai (MSEC) - MCA College Election Voting System

A modern, responsive, and mobile-friendly web application for college student elections, custom built for **Mohamed Sathak Engineering College Kilakarai - Department of Master of Computer Application (MCA)** by **Hareesh (2025-2027 batch)**.

---

## 🌟 Features

- 🗳️ **Multi-Position Voting Wizard**: Interactive multi-step ballot for 6 student council positions:
  - **President** (MCA 2nd Year)
  - **Vice President** (MCA 1st Year)
  - **Secretary** (MCA 2nd Year)
  - **Joint Secretary** (MCA 1st Year)
  - **Treasurer** (MCA 2nd Year)
  - **Treasurer Jr.** (MCA 1st Year)
- 🖼️ **Auto-fitting Candidate Cards**: Responsive grid layouts with candidate photos.
- 🎵 **Web Audio Chimes**: Synthesized audio chimes upon vote submission.
- 📊 **Real-time Admin Dashboard**: Live vote counts, percentage stats, and election controls.
- 🏆 **Winning List & Printable PDF Report**: Instant winner calculation per position with PDF exporting.
- 🏫 **Custom Campus Theme**: Styled with Mohamed Sathak Engineering College Kilakarai colors and campus imagery.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Canvas-Confetti, html2pdf.js
- **Backend**: Node.js, Express.js, SQLite (`better-sqlite3`)
- **State Management**: React Context API

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR-GITHUB-REPOSITORY-URL>
   cd voting-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   # Start the Express Backend (Port 5000)
   node server/index.js

   # Start Vite Frontend (Port 3000)
   npx vite --port 3000
   ```

4. Open `http://localhost:3000` in your browser.




