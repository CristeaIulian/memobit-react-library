// Separate entry point: the theme lab needs @memobit/themes 2.0 (the authored engine), which
// apps still on themes 1.x do not have. Keeping it out of the main bundle means those apps
// never resolve it.
export { ThemeLab, type ThemeLabProps } from './components/ThemeLab';
