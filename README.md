# Chat Simulator (React + TypeScript + Vite)

A simple, interactive chat simulation app with a screen recording feature. Built using **React**, **TypeScript**, and **Vite**, it uses Zustand for client-side state management and Supabase for user and participant data.

All messages and chat content are simulated and stored on the client. The app also supports recording the chat area using `ffmpeg.wasm` and exporting the UI as an image.

---

## 🚀 Features

- ⚡️ Blazing-fast bundling with Vite  
- 🧠 Zustand for lightweight global state  
- 🔐 Supabase Auth + Database (for users and participants)  
- 💬 Real-time chat simulation (client-only messages)  
- 📸 Screen and image capture using FFmpeg + dom-to-image  
- 🎨 Styled using CSS Modules  
- 🧪 ESLint + TypeScript for code quality and safety  

---

## 📦 Tech Stack

| Tool/Library              | Purpose                              |
|---------------------------|--------------------------------------|
| **React + Vite**          | Frontend and bundling                |
| **TypeScript**            | Type safety                          |
| **Zustand**               | State management                     |
| **Supabase**              | Auth + Postgres DB for user data     |
| **FFmpeg + dom-to-image** | Screen and chat UI recording         |
| **CSS Modules**           | Scoped component styling             |
| **ESLint**                | Linting and static analysis          |
| **gh-pages**              | GitHub Pages deployment              |

---

## 🛠️ Scripts

| Command             | Description                                 |
|---------------------|---------------------------------------------|
| `npm run dev`       | Start the Vite development server           |
| `npm run build`     | Build the app for production                |
| `npm run preview`   | Preview the production build                |
| `npm run lint`      | Run ESLint checks                           |
| `npm run deploy`    | Deploy to GitHub Pages                      |

---

## 🌐 Deployment

This app is deployed using **GitHub Pages**.


"homepage": "https://anyiamvictor.github.io/chat-simulator"
