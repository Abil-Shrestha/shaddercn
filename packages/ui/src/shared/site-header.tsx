import { ModeSwitcher } from "@shaddercn/ui/shared/mode-switcher";
import Link from "next/link";

export function SiteHeader({
  mobileNav,
  children,
}: {
  mobileNav?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const gatewayOrigin = process.env.NEXT_PUBLIC_SHADDERCN_URL || "";
  const gatewayHome = gatewayOrigin ? `${gatewayOrigin}/` : "/";
  const isExternal = !!gatewayOrigin;

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <div className="container relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6">
        {mobileNav}
        <div className="-mt-0.5 flex shrink-0 items-center gap-1.5 font-heading text-2xl sm:text-[1.625em]">
          {isExternal ? (
            <a aria-label="Home" href={gatewayHome}>
              shaddercn
            </a>
          ) : (
            <Link aria-label="Home" href={gatewayHome}>
              shaddercn
            </Link>
          )}
        </div>
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {children}
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
