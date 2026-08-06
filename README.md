# 🚀 HireSense AI — Mock Interview Platform

An intelligent, speech-interactive mock interview platform designed to help job seekers practice technical and behavioral interviews. Built with React, TypeScript, Tailwind CSS, Google Gemini AI, Firebase Firestore, and Clerk Auth.

---

## ✨ Features

* 🤖 **AI-Generated Mock Interviews:** Dynamic interview creation based on specific job roles, tech stacks, and experience levels.
* 🎙️ **Interactive Speech & Webcam Interface:** Real-time speech-to-text recording with built-in voice playback (TTS) for interview questions.
* ⏱️ **Answer Timer & Pace Tracker:** Real-time pacing gauge that alerts candidates if answers are too short (< 30s), optimal (30s - 2m), or getting too long.
* 🧠 **Automated Gemini Evaluation:** Instant comparison of candidate speech transcripts against model answers with 1–10 scoring and constructive feedback.
* 📊 **Comprehensive Feedback Dashboard:** Detailed score breakdown, question summaries, and overall performance rating.
* 📄 **Exportable PDF Report Card:** Dedicated print-ready PDF export to save feedback reports locally.
* 🔐 **Secure Authentication:** User authentication and session management powered by Clerk.

---

## 📂 Project Structure

```text
ai-mock-interview-platform/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AnswerTimer.tsx
│   │   ├── QuestionSection.tsx
│   │   └── RecordAnswer.tsx
│   ├── config/
│   ├── Routes/
│   ├── scripts/
│   └── types/
├── public/
├── .env.local
└── package.json
```
---

## 🚀 Getting Started

### Prerequisites

* Node.js: v18.x or higher
* npm / pnpm / yarn

---

### 📦 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/CHITRA2445/hiresense-ai.git
```

```bash
cd ai-mock-interview-platform
```

3. Install dependencies:
```bash
npm install
```

---

3. Create `.env.local`

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=

# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Gemini API
VITE_GEMINI_API_KEY=
```

4. Start the Development Server:
```bash
npm run dev
```

5. Visit:

```
http://localhost:5173
```

---


## 👩‍💻 Author

**Chitra Singh**

- GitHub: https://github.com/CHITRA2445

---
