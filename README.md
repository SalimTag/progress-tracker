# 📱 Progress Tracker — Mobile-First Productivity App

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-iOS%20%26%20Android-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![CI](https://img.shields.io/github/actions/workflow/status/SalimTag/progress-tracker/ci.yml?label=CI&logo=github)](https://github.com/SalimTag/progress-tracker/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A mobile-first productivity app that runs natively on iOS, Android, and the Web from a single codebase. Track activities, manage progress, and stay organized with a fast, native-like experience — built with React, TypeScript, and Capacitor.

![App Demo](./docs/demo.gif)
*Progress Tracker running on iOS, Android, and Web*

---

## 📸 Screenshots

| Dashboard | Activities | Organization |
|-----------|-----------|--------------|
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Activities](./docs/screenshots/activities.png) | ![Organization](./docs/screenshots/organization.png) |

| Dark Mode | Add Activity | Mobile Install |
|-----------|-------------|----------------|
| ![Dark](./docs/screenshots/dark-mode.png) | ![Add](./docs/screenshots/add-activity.png) | ![Install](./docs/screenshots/pwa-install.png) |

---

## ✨ Features

### 📊 Core Functionality
- **Dashboard** — Activity overview with progress summaries
- **Activities Page** — FAB + bottom sheet for quick task creation
- **Organization** — Structured progress tracking by category
- **Smooth Navigation** — Framer Motion transitions between pages

### 📱 Native-Like Experience
- **Haptic Feedback** — Physical vibration on key interactions
- **Pull-to-Refresh** — Native gesture support
- **Local Notifications** — Native push notifications via Capacitor
- **Safe Area Handling** — Proper insets for all iOS notch variants
- **Stable Viewport** — `svh` units for reliable mobile layout

### 🌐 PWA & Offline
- **Installable** — Works on Desktop, iOS, and Android home screens
- **Offline-Ready** — Service worker caching strategies
- **App Icons & Splash Screens** — Auto-generated for all platforms
- **Optimized Bundle** — Fast load via Vite code splitting

### 🎨 UI & Theming
- **Dark Mode** — System-aware automatic switching
- **shadcn/ui Components** — Cards, Buttons, Dialogs, Sheets, Toasts, Skeletons
- **Tailwind CSS v4** — Utility-first styling with design tokens
- **Responsive Layout** — Pixel-perfect on any screen size

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18 | Component-based UI |
| **Language** | TypeScript 5 | Type safety |
| **Build Tool** | Vite 5 | Fast dev server & bundling |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui | Accessible UI primitives |
| **State Management** | Zustand | Lightweight global state |
| **Animations** | Framer Motion | Smooth page transitions |
| **Mobile Bridge** | Capacitor | iOS & Android native features |
| **Native Plugins** | Capacitor Haptics, Notifications, Storage, StatusBar | Native APIs |
| **Testing** | Vitest + React Testing Library | Unit & component tests |
| **Linting** | ESLint + Prettier | Code quality & formatting |
| **CI/CD** | GitHub Actions | Automated build & deploy |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────┐
│             React App (TypeScript)          │
│   Dashboard | Activities | Organization     │
│                                            │
│  ┌────────────┐  ┌──────────────────────┐  │
│  │  Zustand   │  │  shadcn/ui +         │  │
│  │  State     │  │  Tailwind CSS v4     │  │
│  └────────────┘  └──────────────────────┘  │
└────────────────────┬───────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌─────────────────┐   ┌──────────────────────┐
│  Web (PWA)      │   │  Mobile (Capacitor)   │
│  - Service      │   │  - iOS (Swift)        │
│    Worker       │   │  - Android (Kotlin)   │
│  - IndexedDB    │   │  - Haptics            │
│  - Manifest     │   │  - Notifications      │
└─────────────────┘   │  - Local Storage      │
                      └──────────────────────┘
```

---

## 📦 Installation

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 9+ |
| Xcode | 15+ (iOS builds only) |
| Android Studio | Latest (Android builds only) |

### Setup

```bash
# Clone the repository
git clone https://github.com/SalimTag/progress-tracker.git
cd progress-tracker

# Install dependencies
npm install
```

---

## 🛠️ Development

### Web Development Server

```bash
npm run dev
```

App runs at http://localhost:5173 with hot module replacement.

### Available Scripts

```bash
# Development
npm run dev              # Start web dev server
npm run preview          # Preview production build locally

# Build
npm run build            # Build for web production

# Code Quality
npm run type-check       # TypeScript type checking (no emit)
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix lint issues

# Testing
npm run test             # Run tests in watch mode
npm run test:ci          # Run tests once (for CI)
```

---

## 📱 Mobile Development

### Quick Mobile Commands

```bash
# Build and sync web → native
npm run cap:build

# Run in simulators/emulators
npm run cap:run:ios       # iOS Simulator
npm run cap:run:android   # Android Emulator

# Open in native IDEs
npm run cap:open:ios      # Opens Xcode
npm run cap:open:android  # Opens Android Studio
```

### Hot Reload on Device

```bash
npm run mobile:dev        # iOS simulator with live reload
```

### Release Builds

```bash
npm run mobile:build:ios      # iOS Archive (.ipa)
npm run mobile:build:android  # Android Release (.apk / .aab)
```

### Asset Generation

```bash
npm run icon:generate     # Generate app icons for all platforms
npm run splash:generate   # Generate splash screens for all platforms
```

> **Note:** Icon and splash generation requires a source image at `public/icon.png` (minimum 1024×1024px).

---

## 📁 Project Structure

```
progress-tracker/
├── android/                    # Android native project (Capacitor)
├── ios/                        # iOS native project (Capacitor)
├── public/
│   ├── icons/                  # App icons (all sizes)
│   ├── splash/                 # Splash screens
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── shared/             # App-specific shared components
│   ├── pages/
│   │   ├── Dashboard.tsx       # Home dashboard
│   │   ├── Activities.tsx      # Activity list + FAB
│   │   └── Organization.tsx    # Progress organization
│   ├── store/
│   │   └── useAppStore.ts      # Zustand global state
│   ├── hooks/
│   │   └── useNativeFeatures.ts # Capacitor plugin abstractions
│   ├── utils/
│   │   └── testUtils.ts        # Test helper utilities
│   ├── setupTests.ts           # Vitest + mock setup
│   ├── App.tsx                 # App shell + routing
│   └── main.tsx                # Entry point
├── capacitor.config.ts         # Capacitor configuration
├── tailwind.config.ts          # Tailwind setup
├── vite.config.ts              # Vite setup
└── package.json
```

---

## 🌐 PWA Features

The app is fully installable as a Progressive Web App:

| Feature | Implementation |
|---------|---------------|
| **Installable** | Web App Manifest with icons and theme |
| **Offline Support** | Service Worker with caching strategies |
| **Safe Areas** | CSS env() variables for iOS notch support |
| **Stable Viewport** | `svh` units prevent mobile URL bar jumping |
| **Fast Loading** | Vite code splitting + lazy-loaded routes |
| **App-Like Feel** | `display: standalone`, fullscreen mode |

### Install on iOS (Safari)
1. Open in Safari
2. Tap the **Share** button (📤)
3. Select **Add to Home Screen**

### Install on Android (Chrome)
1. Open in Chrome
2. Tap the **three-dot menu**
3. Select **Install App**

---

## 🧪 Testing

Tests run in a jsdom browser-like environment via Vitest. Capacitor and browser-only APIs are safely mocked in `src/setupTests.ts`.

```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:ci

# Type checking
npm run type-check
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../pages/Dashboard'
import { renderWithProviders } from '../utils/testUtils'

describe('Dashboard', () => {
  it('renders activity summary', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/activity overview/i)).toBeInTheDocument()
  })
})
```

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs on every push and pull request:

| Job | Trigger | Steps |
|-----|---------|-------|
| **Lint & Type Check** | Push / PR | ESLint → TypeScript |
| **Test** | Push / PR | Vitest test suite |
| **Web Build** | Push to `main` | Vite build → Vercel deploy |
| **iOS Build** | Push to `main` | Capacitor sync → Xcode archive → artifact |
| **Android Build** | Push to `main` | Capacitor sync → Gradle build → APK artifact |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/NewFeature`)
3. **Commit** your changes (`git commit -m 'Add: NewFeature'`)
4. **Push** to the branch (`git push origin feature/NewFeature`)
5. **Open** a Pull Request

Please ensure:
- `npm run lint` passes with no warnings
- `npm run type-check` passes with no errors
- `npm run test:ci` passes
- Code follows existing patterns and conventions

---

## 🗺️ Roadmap

- [ ] Polish UI — dark mode refinements, spacing, typography
- [ ] User authentication — Supabase / Firebase
- [ ] Activity categories & filters
- [ ] Cloud sync — offline-first with background sync
- [ ] Recurring tasks and reminders
- [ ] Progress charts and statistics
- [ ] Export data as CSV / PDF
- [ ] Apple Watch & Wear OS companion app
- [ ] Widgets (iOS & Android)

---

## 📄 License

MIT © 2025 Salim Tagemouati — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Salim Tagemouati**

- 🌐 GitHub: [@SalimTag](https://github.com/SalimTag)
- 💼 LinkedIn: [Salim Tagemouati](#) <!-- Add your LinkedIn URL -->
- 🌍 Location: Morocco
- 💡 Open to opportunities in Mobile, Frontend, and Full-Stack Engineering

---

<p align="center">
  <b>⭐ Star this repo if you find it useful!</b>
</p>

<p align="center">
  Made with ❤️ in Morocco 🇲🇦 by <a href="https://github.com/SalimTag">Salim Tagemouati</a>
</p>

<p align="center">
  <sub>📱 One codebase. Three platforms. Zero compromise.</sub>
</p>
