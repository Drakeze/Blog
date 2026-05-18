// Allow TypeScript to resolve CSS side-effect imports (e.g. import './globals.css')
// Actual bundling is handled by Next.js/Webpack — this is purely for type-checking.
declare module "*.css" {}
