<h3 align="center">Shaddercn</h3>
<p align="center">An <strong>agent-native design system</strong> built for coding agents.</p>

> **Warning:** This project is in very early development and is not recommended for production use. I'm actively working on it.

## About the Project

Shaddercn is an agent-native design system built for coding agents. It is not meant for manual use by humans.

That means there are no installation steps, no "copy/paste this into your app", and no "how to use" guides.

Instead, the interface is a **single registry fetch** that an agent can consume.

## Repository Overview

### Apps and Packages

- **`apps/ui/`** - Shaddercn UI component library and documentation
- **`packages/ui/`** - Shared UI components package
- **`packages/shaddercn/`** - Shaddercn registry package
- **`packages/typescript-config/`** - TypeScript configurations
- **`biome.json`** - Shared Biome configuration for linting and formatting

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Environment Variables

For local development, create a `.env.local` file in `apps/ui/`:

```sh
# apps/ui/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000/ui
```

> [!NOTE]
> Turborepo is configured to watch for changes in `.env*` files, so it will automatically invalidate the cache when these variables change.

### Development

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting

#### Build

To build all apps and packages:

```sh
bun run build
```

To build the app:

```sh
bun run build --filter=ui
```

#### Develop

To start the dev server with turbopack:

```sh
bun run dev --filter=ui
```

The app will run on http://localhost:3000

## Agent Registry

Fetch the current Shaddercn registry:

```bash
curl -s http://localhost:3000/ui/shaddercn/registry
```

## Inspiration

Shaddercn is inspired by:

- shadcn
- tremor
- Radix UI
- Base UI
- shaddercn (previously Origin UI)

## Licensing

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to:

- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework that powers our design system
- **[Base UI](https://base-ui.com/)** - For providing the robust, accessible primitives that form the foundation of our components
- **[shadcn/ui](https://ui.shadcn.com/)** - For inspiring our copy-paste approach and component philosophy
- **[Fumadocs](https://fumadocs.dev/)** - For providing the documentation framework that powers our component docs
