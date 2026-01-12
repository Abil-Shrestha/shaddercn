# Shared Fonts

This directory contains shared font files and configurations used across all apps in the monorepo.

## Usage

Import fonts directly from the shared UI package:

```tsx
import { fontSans, fontHeading } from "@shaddercn/ui/fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontHeading.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

## Available Fonts

- `fontSans` - Geist (Next.js default template)
- `fontHeading` - Geist (used for headings)
- `fontMono` - Geist Mono

## Adding New Fonts

1. Place the font file in this directory (`packages/ui/src/fonts/`)
2. Add a new font configuration in `index.ts`:

```typescript
export const yourNewFont = localFont({
  display: "swap",
  src: "./YourFont.woff2",
  variable: "--font-your-name",
});
```

3. Use it in any app by importing from `@shaddercn/ui/fonts`

## Benefits of This Approach

- Single source of truth for fonts
- No fragile relative paths
- Type-safe imports
- Versioned with the UI package
- Easy to update across all apps
