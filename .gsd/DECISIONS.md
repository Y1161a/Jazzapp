# DECISIONS.md — Architectural Decision Records (ADR)

## ADR-001: Mobile-first React + Vite + Tailwind CSS Architecture
- **Date**: 2026-11-23
- **Context**: Need a responsive, extremely fast mobile web application with offline PWA capabilities and elegant UI styling.
- **Decision**: Use React 19 / 18 with Vite, Tailwind CSS with native CSS logical properties for smooth RTL/LTR flipping, and Lucide icons.
- **Consequences**: Fast build times, zero latency, lightweight client footprint, perfect offline capabilities.

## ADR-002: Local-Only Storage with JSON Export/Import
- **Date**: 2026-11-23
- **Context**: User explicitly requested local storage on device with no cloud server dependency.
- **Decision**: Store all application state in browser local storage / IndexedDB with automatic schema migrations, and provide a 1-click JSON backup export and restore tool.
- **Consequences**: Maximum privacy, zero recurring hosting/database costs, works 100% offline.
