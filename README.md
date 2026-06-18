# @memobit/libs

A TypeScript-first React component library — 100+ components, 470+ icons, 70+ themes, plus the hooks and helpers needed to glue them together. Built for, and battle-tested across, the [Memobit](https://memobit.ro) family of apps.

**📚 Live documentation & component playground → [react.memobit.ro](https://react.memobit.ro/)**

---

## Install

```bash
npm install @memobit/libs
```

Peer dependencies (you provide these in your own app):

```bash
npm install react@^19 react-dom@^19
```

## Quick start

```tsx
import { Button, Card, ToastProvider, useToast } from '@memobit/libs';
import '@memobit/libs/dist/index.css';
import '@memobit/libs/dist/styles/themes.scss'; // optional — only if you want the bundled themes

function App() {
  return (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  );
}

function Demo() {
  const { showToast } = useToast();
  return (
    <Card>
      <Button onClick={() => showToast({ type: 'success', message: 'Hello' })}>
        Click me
      </Button>
    </Card>
  );
}
```

## What's in the box

- **Components** — Buttons, forms (Input/Select/Checkbox/DatePicker/ColorPicker/EmojiPicker/FileDropzone…), navigation (Breadcrumb/AppHeader/ControlPanel/Tabs…), overlays (Drawer/Modal/ConfirmDialog/ContextMenu/Tooltip…), data (DataView/Table/Calendar/CalendarHeatmap/Chart…), feedback (Toast/Banner/Badge/Chip/EmptyState…), and many more.
- **Icons** — 470+ stroke icons, each tree-shakeable.
- **Themes** — 70+ ready-made SCSS themes (Arctic Blue, Midnight Atlas, Terracotta Kitchen, Neon Tokyo, …). Theme tokens are pure CSS custom properties, so you can author your own.
- **Hooks** — `useBreakpoint`, `useBodyScrollLock`, `useComponentEffect`, `useAppPersistence`, `useAuth`.
- **Helpers** — date formatting, number formatting, string utilities, search/highlight, pagination, URL helpers.

See the [component reference](https://react.memobit.ro/) for props, variants, and live examples.

## Theming

Themes ship as standalone SCSS files. Pick what you need:

```scss
// import everything
@use '@memobit/libs/dist/styles/themes.scss';

// or a single theme
@use '@memobit/libs/dist/styles/theming/arctic-blue.scss';
```

All tokens — spacing, typography, radii, transitions, colors — are exposed as CSS custom properties (`--spacing-8`, `--card-bg`, `--button-primary-bg`, etc.) so you can override per-component or per-route without forking the library.

Token reference:

- Sizing / spacing / radii / transitions → `@memobit/libs/dist/styles/variables.scss`
- Theme colors → `@memobit/libs/dist/styles/theming/*.scss`

## Requirements

- React **19.2+** and React DOM **19.2+** (peer deps)
- ESM-only (your bundler must support ESM — Vite, Next.js 13+, Webpack 5, esbuild, Rollup all do)
- For SCSS imports: a Sass-capable bundler

## TypeScript

Type definitions are bundled (`dist/index.d.ts`). No `@types/...` package required.

## License

[Apache 2.0](./LICENSE) © Iulian Cristea

## Links

- 📚 Docs & playground — https://react.memobit.ro/
- 🐙 Source — https://github.com/CristeaIulian/memobit-react-library
- 📦 npm — https://www.npmjs.com/package/@memobit/libs
