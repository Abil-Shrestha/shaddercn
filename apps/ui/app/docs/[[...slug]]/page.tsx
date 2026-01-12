import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsCopyPage } from "@/components/docs-copy-page";
import { DocsTableOfContents } from "@/components/docs-toc";
import { source } from "@/lib/source";
import { mdxComponents } from "@/mdx-components";
import { Button } from "@/registry/default/ui/button";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const doc = page.data;

  if (!doc.title || !doc.description) {
    notFound();
  }

  return {
    description: doc.description,
    title: `${doc.title} - Shaddercn`,
  };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const doc = page.data;
  const rawContent = await page.data.getText("raw");
  const MDX = doc.body;

  const links = doc.links;

  return (
    <div className="flex items-stretch xl:w-full" data-slot="docs">
      <div className="relative flex w-full min-w-0 flex-1 flex-col before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-background lg:mt-8 lg:mr-4 lg:mb-8">
        <div className="after:-inset-[5px] after:-z-1 relative flex min-w-0 flex-1 flex-col bg-muted/72 not-dark:bg-clip-padding shadow-sm/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:shadow-[0_1px_--theme(--color-black/6%)] after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] lg:rounded-2xl dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
          <div className="-m-px relative flex min-w-0 flex-1 flex-col bg-background bg-clip-padding px-4 py-6 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] max-lg:before:hidden sm:px-6 lg:rounded-t-2xl lg:rounded-b-xl lg:p-8 dark:before:shadow-[0_-1px_--theme(--color-white/8%)] lg:[clip-path:inset(1px_1px_-1rem_1px_round_var(--radius-2xl)_var(--radius-2xl)_0_0)]">
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex min-w-0 flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="scroll-m-20 font-heading text-3xl xl:text-4xl">
                      {doc.title}
                    </h1>
                    {doc.description && (
                      <p className="text-muted-foreground sm:text-lg">
                        {doc.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    {links?.doc && (
                      <Button
                        render={
                          <Link
                            href={links.doc}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <HugeiconsIcon
                              icon={LinkSquare02Icon}
                              strokeWidth={2.5}
                            />
                            API Reference
                          </Link>
                        }
                        size="xs"
                        variant="outline"
                      />
                    )}
                    <DocsCopyPage page={rawContent} />
                  </div>
                </div>
                <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
                  <MDX components={mdxComponents} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <ScrollArea
          className="**:data-[slot=scroll-area-scrollbar]:hidden"
          scrollFade
        >
          <div className="flex min-h-0 flex-col gap-2 py-2">
            <div className="h-(--top-spacing) shrink-0" />
            {doc.toc?.length ? <DocsTableOfContents toc={doc.toc} /> : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
