# Daily Devotional Companion App (PWA)

A distraction-free, mobile-first Progressive Web App (PWA) built with **React**, **Vite**, and **Tailwind CSS**. Designed for daily spiritual nourishment, it seamlessly consumes live study plans, automatically selects today's reading based on your local date, formats scripture and book passages cleanly, and persistently stores your personal reflections in `localStorage`.

---

## ✨ Features

- **Mobile-First PWA:**
  - Installable to home screen on iOS and Android ("Add to Home Screen").
  - Service Worker (`sw.js`) with stale-while-revalidate caching of endpoints and app shell for full offline functionality.
  - Safe-area inset support for modern edge-to-edge mobile screens.
  - Mobile bottom navigation bar and responsive header.

- **Two Integrated Feeds:**
  1. **Sermon Plan:** Consuming `https://davelane26.github.io/rlcf-study-plan/output/latest.json`.
     - Displays weekly memory verse, sermon audio/video link, daily recap, inspirational quote callout, passages to read, and deep scripture reflection prompt.
     - Automatically selects today's weekday reading (e.g., Thursday) within the current study week.
     - Dedicated Sunday Lord's Day / Church worship screen with memory verse meditation and sermon listening prompt.
  2. **Book Study Plan:** Consuming `https://davelane26.github.io/book-study-plan/output/book-schedule.json` ("Basic Christian Teachings" by Zac Poonen).
     - Displays daily chapter readings mapped to `YYYY-MM-DD`.
     - Chapter drawer/picker for browsing all 100 days/chapters.
     - "Mark as Read" completion tracker saved locally.
     - Proper author copyright attribution.

- **Distraction-Free Reading Experience:**
  - **Themes:** Clean Light, Warm Sepia (book paper style), and Night / Dark Mode.
  - **Typography Controls:** Small, Normal, Large, and Extra Large font sizes.
  - **Typeface Selection:** Serif (Classic book style) and Sans (Modern interface).
  - **Scripture Links & Translation Switcher:** Tap any scripture reference to read it directly on BibleGateway with your preferred translation (NASB 1995, ESV, NIV, NKJV, KJV, CSB, NLT).

- **Personal Reflection Notes & Journal:**
  - Auto-saving reflection notes attached to each sermon day and book chapter.
  - Debounced background saving to `localStorage` with a live "Saved ✓" indicator.
  - Dedicated **Journal** tab:
    - Search notes across all dates and titles.
    - Filter by Sermon vs. Book Study.
    - Export all notes as a Markdown (`.md`) file backup.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Run Locally in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg              # App icon
│   ├── icon-192.png             # PWA 192x192 icon
│   ├── icon-512.png             # PWA 512x512 icon
│   ├── apple-touch-icon.png     # iOS touch icon
│   ├── manifest.webmanifest     # PWA installation manifest
│   └── sw.js                    # Service worker for offline caching
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Sticky app header with date, offline status & settings
│   │   ├── NavigationTabs.tsx   # Top segmented bar & mobile bottom bar
│   │   ├── DateScrubber.tsx     # Horizontal date & day selector
│   │   ├── ReaderControls.tsx   # Typography & theme controls (Light, Sepia, Dark)
│   │   ├── SermonView.tsx       # Distraction-free Sermon Study view
│   │   ├── BookStudyView.tsx    # Distraction-free Book Study chapter view
│   │   ├── ReflectionNotes.tsx  # Auto-saving reflection note input
│   │   ├── JournalView.tsx      # Unified journal with search, filter, and export
│   │   ├── ScriptureLink.tsx    # Clickable passage link to BibleGateway
│   │   └── SundayRestView.tsx   # Lord's Day / Church worship screen
│   ├── hooks/
│   │   ├── useDevotionalData.ts # Data fetching with offline caching
│   │   ├── useLocalStorage.ts   # Persistent state hook
│   │   └── useReaderSettings.ts # Theme and font size settings
│   ├── types/
│   │   └── devotional.ts        # TypeScript schemas for feeds and notes
│   ├── utils/
│   │   ├── dateUtils.ts         # Today matching, date math, day formatting
│   │   └── scriptureUtils.ts    # Scripture reference formatting and BibleGateway URLs
│   ├── App.tsx                  # Root app layout and tab state
│   ├── main.tsx                 # App mount & PWA service worker registration
│   ├── index.css                # Tailwind base, Sepia theme, and typography styles
│   └── vite-env.d.ts            # Vite client type definitions
├── index.html                   # HTML template with mobile viewport & PWA meta
├── tailwind.config.js           # Tailwind theme configuration
├── vite.config.ts               # Vite build configuration
└── tsconfig.json                # TypeScript configuration
```

