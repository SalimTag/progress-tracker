# Progress Tracker

A mobile-first productivity app built with React, TypeScript, and Vite, optimized for Web, iOS, and Android via PWA + Capacitor. Track activities, manage progress, and stay organized with a fast, native-like experience.

## 🚀 Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Capacitor (iOS & Android)
- Dark mode
- Capacitor Plugins: Haptics, Local Notifications, Storage, StatusBar
- Vitest + React Testing Library
- ESLint + Prettier
- GitHub Actions

---

## ✨ Features

- Dashboard with activity overview
- Activities page with FAB + bottom sheet to add tasks
- Organization page for structured progress tracking
- Reusable components (`shadcn/ui`): Cards, Buttons, Dialogs, Sheets, Toasts, Skeletons
- Native-like interactions: haptics, pull-to-refresh, safe areas
- Offline-ready PWA with caching strategies
- Installable on Desktop, iOS, and Android
- Smooth navigation with Framer Motion

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

- Type-check: `npm run type-check`
- Run tests (watch): `npm run test`
- CI run: `npm run test:ci`

Vitest runs in a jsdom browser-like environment.
Capacitor and browser-only APIs are safely mocked in `src/setupTests.ts`.

---

## ⚙️ CI/CD

- Linting & testing
- Web build → deploy to Vercel
- Mobile build → iOS Archive + Android APK artifacts

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

- Installable with app icons and splash screens
- Works offline with service worker caching
- Safe area insets handled for iOS
- Optimized viewport units (`svh`) for mobile stability

## 📌 Roadmap

- [ ] Polish UI (dark mode, spacing, typography)
- [ ] Add user authentication (Supabase / Firebase)
- [ ] Add activity categories & filters
- [ ] Store sync (cloud + offline-first)

---

## 📝 License

MIT © 2025 Salim Tagemouati
