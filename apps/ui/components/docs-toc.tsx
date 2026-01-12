"use client";

import { AnchorProvider } from "fumadocs-core/toc";
import * as React from "react";
import { cn } from "@/lib/utils";

type Toc = React.ComponentProps<typeof AnchorProvider>["toc"];

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!activeId && itemIds?.length) {
      setActiveId(itemIds[0] ?? null);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds, activeId]);

  return activeId;
}

export function DocsTableOfContents({
  toc,
  className,
  style = "normal",
}: {
  toc: Toc;
  className?: string;
  style?: "normal" | "clerk";
}) {
  const itemIds = React.useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc],
  );
  const activeHeading = useActiveItem(itemIds);

  if (!toc?.length) {
    return null;
  }

  if (style === "clerk") {
    return (
      <div
        className={cn(
          "z-10 flex flex-col gap-1 py-2 ps-6 pe-4 text-sm",
          className,
        )}
      >
        <p className="flex h-7 items-center font-medium text-xs">
          On This Page
        </p>
        <div className="relative ms-3.5 flex flex-col gap-0.5">
          <AnchorProvider toc={toc}>
            {toc.map((item, index) => {
              const isActive = item.url === `#${activeHeading}`;
              const prevDepth =
                index > 0 ? (toc[index - 1]?.depth ?? item.depth) : item.depth;
              const nextDepth =
                index < toc.length - 1
                  ? (toc[index + 1]?.depth ?? item.depth)
                  : item.depth;

              return (
                <a
                  className={cn(
                    "relative py-1 text-[.8125rem] text-sidebar-foreground leading-4.5 no-underline transition-colors",
                    "hover:bg-transparent hover:text-foreground",
                    "data-[depth=3]:ps-3.5",
                    "data-[depth=4]:ps-5.5",
                    "data-[active=true]:text-foreground",
                  )}
                  data-active={isActive}
                  data-depth={item.depth}
                  href={item.url}
                  key={item.url}
                  style={
                    {
                      "--toc-depth": item.depth - 2,
                      "--toc-next-depth": nextDepth - 2,
                      "--toc-prev-depth": prevDepth - 2,
                    } as React.CSSProperties
                  }
                >
                  {item.title}
                </a>
              );
            })}
          </AnchorProvider>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "z-10 flex flex-col gap-1 py-2 ps-6 pe-4 text-sm",
        className,
      )}
    >
      <p className="flex h-7 items-center font-medium text-xs">On This Page</p>
      <div className="before:-left-3.25 relative ms-3.5 flex flex-col gap-0.5 before:absolute before:inset-y-0 before:w-px before:bg-border">
        <AnchorProvider toc={toc}>
          {toc.map((item) => (
            <a
              className={cn(
                "relative py-1 text-[.8125rem] text-sidebar-foreground leading-4.5 no-underline transition-colors",
                "before:-left-3.25 before:absolute before:inset-y-px before:w-px before:rounded-full before:bg-transparent",
                "hover:bg-transparent hover:text-foreground",
                "data-[depth=3]:ps-3.5",
                "data-[depth=4]:ps-5.5",
                "data-[active=true]:text-foreground",
                "data-[active=true]:before:w-0.5",
                "data-[active=true]:before:bg-primary",
              )}
              data-active={item.url === `#${activeHeading}`}
              data-depth={item.depth}
              href={item.url}
              key={item.url}
            >
              {item.title}
            </a>
          ))}
        </AnchorProvider>
      </div>
    </div>
  );
}
