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
## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Components** | Tailwind CSS, Lucide Icons, Shadcn UI |
| **Authentication** | Clerk (`@clerk/clerk-react`) |
| **Database** | Firebase Firestore |
| **AI Engine** | Google Gemini API |
| **Voice Processing** | `react-hook-speech-to-text`, Web Speech Synthesis API |

---

## 📂 Project Structure

```text
ai-mock-interview-platform/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── AnswerTimer.tsx
│   │   ├── Containers.tsx
│   │   ├── CustomBreadCrum.tsx
│   │   ├── Footer.tsx
│   │   ├── FormMockInterview.tsx
│   │   ├── Generate.tsx
│   │   ├── Header.tsx
│   │   ├── Headings.tsx
│   │   ├── InterviewPin.tsx
│   │   ├── LogoContainer.tsx
│   │   ├── marquee-img.tsx
│   │   ├── Model.tsx
│   │   ├── NavigationRoutes.tsx
│   │   ├── ProfileContainer.tsx
│   │   ├── QuestionSection.tsx
│   │   ├── RecordAnswer.tsx
│   │   ├── SaveModel.tsx
│   │   ├── ToggleContainer.tsx
│   │   └── TooltipButton.tsx
│   ├── config/
│   ├── handlers/
│   ├── layouts/
│   │   ├── AuthenticationLayout.tsx
│   │   ├── MainLayouts.tsx
│   │   ├── ProtectedRoutesLayout.tsx
│   │   └── PublicLayouts.tsx
│   ├── lib/
│   │   ├── helper.ts
│   │   └── utils.ts
│   ├── provider/
│   ├── Routes/
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── CreateEditPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FeedBack.tsx
│   │   ├── Home.tsx
│   │   ├── Loaderpage.tsx
│   │   ├── MockInterviewPage.tsx
│   │   ├── MockLoadPage.tsx
│   │   ├── Servives.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── scripts/
│   │   └── index.ts
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.local
├── .firebaserc
├── .gitignore
├── components.json
├── eslint.config.js
├── firebase.json
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
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
cd hiresense-ai
```

2. Install dependencies:
```bash
npm install
```

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
