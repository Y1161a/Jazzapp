# ROADMAP.md — Jazzapp

> **Current Phase**: Complete
> **Milestone**: v1.0 (Shipped)
> **Author**: ياسين وشتاتي (Yassine Ouachtati)

## Must-Haves (from SPEC)
- [x] PWA architecture with Vite, React, TypeScript, Tailwind CSS, and Lucide icons.
- [x] Bilingual dictionary system (Arabic RTL + French LTR).
- [x] Expenses & Obligations module with manual reminder timestamps and status tracking.
- [x] Simple Inventory tracking module with low-stock warnings and quick adjustment controls.
- [x] Local persistence layer with full JSON export and restore.
- [x] High-end UI with cafe jazz aesthetic, dark/light theme, and mobile ergonomics.
- [x] PWA manifest and service worker with notification support.
- [x] Production build verified and committed/pushed to GitHub.

---

## Phases

### Phase 1: Foundation & Application Setup
**Status**: 🟩 Completed
**Objective**: Bootstrap the modern React + Vite + TypeScript PWA application with Tailwind CSS, Lucide icons, responsive layout shell, and i18n support.

### Phase 2: Core State & Persistence
**Status**: 🟩 Completed
**Objective**: Implement local state management (localStorage) for Obligations, Inventory items, Reminder logs, and Settings (Language, Theme), with JSON export/import.

### Phase 3: Expenses & Reminder Module
**Status**: 🟩 Completed
**Objective**: Build the Obligations management interface: category selection, amount, due date, custom reminder date-time picker, status toggle (Pending/Paid), and notification triggers.

### Phase 4: Inventory Management Module
**Status**: 🟩 Completed
**Objective**: Build the Stock management interface: item details, units (kg, L, pcs), stock-in/out quick buttons, threshold limits, and visual low-stock indicator.

### Phase 5: Dashboard & Visual Polish
**Status**: 🟩 Completed
**Objective**: Design the Jazz-themed mobile dashboard with monthly expense summaries, upcoming deadlines counter, low-stock alerts, and creator credits to ياسين وشتاتي.

### Phase 6: PWA Integration & Verification
**Status**: 🟩 Completed
**Objective**: Add PWA manifest, service worker registration, offline caching, test production build, verify all features, commit and push to remote.
