Progress Tracker
A mobile-first productivity app** built with **React, TypeScript, Vite**, and optimized for both **Web + iOS + Android** using **PWA + Capacitor**.
The app helps users track activities, manage progress, and stay organized with a seamless native-like experience.

## 🚀 Tech Stack
 ⚛️ React 18 + TypeScript** – Component-driven UI
* ⚡ Vite** – Lightning-fast build tooling
 🎨 Tailwind CSS v4** – Utility-first styling
 🧩 shadcn/ui** – Accessible headless UI components
 📦 Zustand** – Lightweight state management
* 📱 Capacitor** – Native iOS & Android builds from the same codebase
* 🌙 Dark mode** – System preference aware
* 🔔 Capacitor Plugins** – Haptics, Notifications, Storage, StatusBar
* ✅ Jest + React Testing Library** – Unit & integration testing
* 🧹 ESLint + Prettier** – Code quality and formatting
* 🔄 GitHub Actions** – CI/CD for Web + Mobile builds
---
## ✨ Features
* 📊 **Dashboard** with activity overview
* 📝 **Activities Page** with FAB + bottom sheet to add tasks
* 🏢 **Organization Page** for structured progress tracking
* 🧩 **Reusable Components** via `shadcn/ui` (Cards, Buttons, Dialogs, Sheets, Toasts, Skeletons)
* 📲 **Native-like Interactions** – haptics, pull-to-refresh, safe areas
* 🔒 **Offline-ready PWA** with caching strategies
* 📦 **Installable** on Desktop, iOS, and Android
* 🎭 **Framer Motion** animations for smooth navigation

---
## 📦 Installation
```bash
# Clone the repo
git clone https://github.com/SalimTag/progress-tracker.git
cd progress-tracker

# Install dependencies
npm install
```
---
## 🛠️ Development

```bash
# Run web dev server
npm run dev

# Type-check
npm run type-check

# Lint
npm run lint
npm run lint:fix

# Run tests
npm run test
```

---
## 🌐 Web Build & Preview

```bash
npm run build
npm run preview
```
---
## 📱 Mobile (iOS & Android)

```bash
# Sync web build with Capacitor
npm run cap:build

# Run in iOS simulator
npm run cap:run:ios

# Run in Android emulator
npm run cap:run:android
```
You can also open the native projects manually:
```bash
npm run cap:open:ios
npm run cap:open:android
```
---
## 🧰 Useful Scripts

```bash
npm run icon:generate   # Generate all app icons
npm run splash:generate # Generate splash screens
npm run mobile:dev      # Run iOS simulator with hot reload
npm run mobile:build:ios     # Build iOS release
npm run mobile:build:android # Build Android release
```

---
## 🧪 Testing

```bash
npm run test       # Run all tests
npm run test:watch # Watch mode
npm run test:ci    # CI-friendly tests
```

Includes mobile-specific helpers in `src/utils/testHelpers.ts` for simulating touch, viewport, and Capacitor features.

---

## ⚙️ CI/CD

* **GitHub Actions** pipeline for:

  * ✅ Linting & Testing
  * 🌐 Web build → deploy to Vercel
  * 📱 Mobile build → iOS Archive + Android APK artifacts

---
## 📖 Project Structure
```
progress-tracker/
├── android/                # Android native project (Capacitor)
├── ios/                    # iOS native project (Capacitor)
├── public/                 # Icons, splash screens, manifest
├── src/
│   ├── components/         # UI components (shadcn/ui + custom)
│   ├── pages/              # Dashboard, Activities, Organization
│   ├── store/              # Zustand state management
│   ├── hooks/              # Custom hooks (e.g. useNativeFeatures)
│   ├── utils/              # Helpers & test utilities
│   ├── App.tsx             # Main app shell
│   └── main.tsx            # Entry point
├── capacitor.config.ts     # Capacitor configuration
├── tailwind.config.ts      # Tailwind setup
├── vite.config.ts          # Vite setup
└── package.json
```
## 📱 PWA Features
* Installable with app icons and splash screens
* Works offline with service worker caching
* Safe area insets handled for iOS
* Optimized viewport units (`svh`) for mobile stability

## 📌 Roadmap
* [ ] Polish UI (dark mode, spacing, typography)
* [ ] Add user authentication (Supabase / Firebase)
* [ ] Add activity categories & filters
* [ ] Add push notifications for reminders
* [ ] Store sync (cloud + offline-first)
---
## 📝 License
MIT © 2025 Salim Tagemouati
