export const appConfig = {
  description: "An agent-native design system built for coding agents.",
  name: "shaddercn",
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/particles",
      label: "Particles",
    },
  ],
  ogImage: "/og.jpg",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/ui",
};
