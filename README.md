# 🎓 Student Portal (PortalX)

A modern, comprehensive, and responsive Student Portal built with React 19, TypeScript, and Tailwind CSS. Track daily class attendance, course notes, imminent assignment deadlines, real-time GPA and grade projections, plus a smart class timetable and Pomodoro study focus hub.

---

## ✨ Features

1. **Daily Attendance Tracker with % Calculation**:
   - Live overall attendance percentage calculation and subject-by-subject percentage breakdown.
   - Compliance status alerts based on configurable minimum threshold (default 75% target).
   - Smart Bunk & Attend Forecast:
     - *Safe Zone*: Calculates how many classes you can skip while staying above 75%.
     - *Critical Warning*: Calculates the exact number of consecutive classes you must attend to restore compliance.
   - Quick one-click "Mark All Present Today" and interactive manual logging.

2. **All Notes Repository**:
   - Filter notes by course or category, plus instant search across titles, tags, and content.
   - Pinned notes, syntax-highlighted code blocks, and formatted markdown rendering.
   - Note reader modal with one-click clipboard copying and `.txt` file export.
   - Create new notes with built-in lecture summary templates.

3. **Upcoming Assignment Deadlines**:
   - Real-time countdown timers (`Due in 2 days`, `Due in 4 hrs`, `Overdue by 1d`).
   - Priority indicators (High, Medium, Normal) and grade weightage percentages.
   - Interactive turn-in modal: submit solution links (e.g. GitHub repos) or execution notes with celebratory animations.
   - Graded assignments section with instructor feedback and scores.

4. **Real-Time Grade Updates & GPA Calculator**:
   - Live Semester GPA (4.00 scale) and cumulative academic standings.
   - Course-by-course breakdown with expandable assessments (quizzes, labs, midterms, projects).
   - Record new assessment scores on the fly and watch your GPA recalculate instantly.
   - **Target Grade Simulator**: Predicts the exact score needed on your final exam to secure your desired letter grade (A, A-, B+, etc.).

5. **🌟 Extra Feature by Developer: Smart Class Schedule & Pomodoro Study Hub**:
   - Interactive Monday–Friday class timetable with room coordinates, lecture types, and professors.
   - Integrated Pomodoro focus timer (25m standard focus, 50m deep sprint, 5m breaks).
   - Daily study checklist linked to courses to keep daily routines productive.

6. **Local Persistence & Portability**:
   - Automatically saves all portal states in browser `localStorage`.
   - Built-in **Export JSON Backup** and **Reset to Demo** buttons in the top navbar.

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### 1. Clone or Download Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd student-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be running at `http://localhost:3000` (or `http://localhost:5173`). Open your browser to access the portal!

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 File Structure

```text
├── index.html                           # Entry HTML with typography and meta tags
├── package.json                         # Project dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite configuration with Tailwind CSS plugin
├── metadata.json                        # Application metadata
├── src/
│   ├── main.tsx                         # React entry point
│   ├── App.tsx                          # Core application state, tabs, and persistence
│   ├── index.css                        # Tailwind CSS imports and base styles
│   ├── types.ts                         # Complete TypeScript data models
│   ├── data/
│   │   └── mockData.ts                  # Comprehensive initial student dataset
│   ├── utils/
│   │   └── studentCalculations.ts       # Attendance % math, GPA calculations, countdown logic
│   └── components/
│       ├── Navbar.tsx                   # Top navigation bar with status badges & export
│       ├── OverviewDashboard.tsx        # High-level student summary with KPIs and alerts
│       ├── AttendanceView.tsx           # Subject attendance breakdowns and attendance log
│       ├── NotesView.tsx                # Searchable notes repository & reader modal
│       ├── AssignmentsView.tsx          # Deadlines countdown and turn-in submission
│       ├── GradesView.tsx               # Real-time GPA calculator and final exam simulator
│       └── TimetableAndStudyView.tsx    # Class timetable & Pomodoro study focus room
└── README.md                            # Documentation and local setup instructions
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Motion
- **Build Tool**: Vite
