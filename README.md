# Memobit React Library

## Overview
This repository contains the `@memobit/libs` React component library and its playground.
The library exports UI components, hooks, and helpers for reuse across projects.

## Structure
- `src/components`: All UI components (each in its own folder with `Component.tsx`, `Component.scss`, and `index.ts`).
- `src/contexts`: Shared contexts (e.g., Auth).
- `src/hooks`: Reusable hooks (e.g., `useBreakpoint`, `useAuth`).
- `src/helpers`: Utility functions (formatting, dates, strings).
- `src/index.ts`: Public export surface for the library.
- `playground`: Vite app for component demos and usage examples.

## Key Concepts
- **Component isolation**: Each component is self-contained and exported via `src/index.ts`.
- **Theming**: The playground loads theme styles under `src/styles/theming`.
- **Playground routing**: `playground/src/routes.ts` drives the sidebar and page routes.
- **Auth module**: Auth components + context live under `src/components/Auth` and `src/contexts/AuthContext`.

## Using the Playground
- Example pages are under `playground/src/pages`.
- Add a new example by creating a page and registering it in `playground/src/routes.ts`.

## Library Usage
- Import components from `@memobit/libs` (see `src/index.ts` for the full list).
- Prefer internal components over raw HTML controls where possible.

## Notes
- Build output goes to `dist/`.
- The library is TypeScript-first and ships type definitions.
