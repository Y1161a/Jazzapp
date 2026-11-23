# SPEC.md — Project Specification: Jazzapp

> **Status**: `FINALIZED`
> **Author**: ياسين وشتاتي (Yassine Ouachtati)
> **App Name**: Jazzapp

## Vision
Jazzapp is a mobile-first Progressive Web App (PWA) tailored specifically for single cafe owners to seamlessly manage all cafe recurring obligations, utility bills, taxes, and inventory in one elegant, distraction-free interface. It features local-only device storage, manual notification scheduling, and a refined cafe jazz aesthetic with full Arabic (RTL) and French support.

## Goals
1. **Obligations & Bills Tracking**: Record, categorize, and monitor cafe fixed & variable dues (electricity, water, internet, municipal taxes, rent, supplies) with due dates, amounts, and paid/unpaid statuses.
2. **Custom Reminder System**: Allow manual configuration of reminder date and time for each obligation, providing in-app alert badges and Web Notifications via PWA.
3. **Streamlined Stock / Inventory**: Track key cafe items (coffee beans, milk, sugar, cups, etc.) with simple Stock-In and Stock-Out operations, low-stock threshold triggers, and unit measurements.
4. **Local Data Sovereignty & Offline Capability**: 100% on-device storage (localStorage/IndexedDB) with zero external server dependencies, full offline PWA functionality, and manual JSON backup export/import.
5. **Exceptional Mobile UX/UI Design**: A warm, polished, modern jazz cafe aesthetic with seamless dark/light modes, bilingual RTL/LTR switching (Arabic default + French), and responsive mobile ergonomics.

## Non-Goals (Out of Scope)
- Point of Sale (POS) and daily receipts checkout register.
- Cloud authentication / multi-user RBAC.
- Payment gateway processing (bills are marked paid manually).

## Users
- Single cafe manager / owner (ياسين وشتاتي) managing all day-to-day cafe operational dues and raw materials on a smartphone or tablet.

## Constraints
- **Platform**: Progressive Web App (PWA) installable on mobile devices (iOS / Android / Desktop).
- **Storage**: Local on-device storage only, no cloud database required, with JSON backup/restore.
- **Languages**: Bilingual Arabic (RTL) & French (LTR).
- **Performance**: Instant load, zero external network latency, full offline functionality.

## Success Criteria
- [ ] Responsive PWA with manifest, service worker, and app icon.
- [ ] Expenses & Obligations CRUD with custom reminder scheduling and status filters.
- [ ] Inventory CRUD with stock in/out adjustments and low-stock alerts.
- [ ] Interactive Dashboard summarizing total pending vs paid bills, upcoming deadlines, and low-stock warnings.
- [ ] Seamless Arabic (RTL) and French language toggling with persistent preference.
- [ ] Local storage persistence with JSON export/import for safe backup.
- [ ] Clean build with zero TypeScript / lint / bundler errors.
- [ ] Git commit and push to remote repository.
