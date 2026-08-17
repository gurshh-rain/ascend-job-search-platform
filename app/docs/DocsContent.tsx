"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { docBody, docToc } from "./content";

const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

export default function DocsContent() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [tocVisible, setTocVisible] = useState(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || (body as unknown as { __copyReady?: boolean }).__copyReady)
      return;

    const blocks = body.querySelectorAll<HTMLElement>(".code-block");
    const orphanPres = body.querySelectorAll<HTMLElement>(
      "pre:not(.code-block pre)"
    );
    [...blocks, ...orphanPres].forEach((block) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = copyIcon;
      btn.addEventListener("click", async () => {
        const pre = block.querySelector("pre") || block;
        const text = pre.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = checkIcon;
          setTimeout(() => {
            if (btn.isConnected) btn.innerHTML = copyIcon;
          }, 1500);
        } catch {
          // ignore
        }
      });
      block.appendChild(btn);
    });

    (body as unknown as { __copyReady?: boolean }).__copyReady = true;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white hover:text-zinc-300"
          >
            Ascend
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 lg:hidden"
              onClick={() => setTocVisible((v) => !v)}
            >
              {tocVisible ? "Hide" : "On this page"}
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
        <aside className={`${tocVisible ? "block" : "hidden"} lg:block`}>
          <nav
            className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg"
            aria-label="Table of contents"
          >
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              On this page
            </h2>
            <div
              className="docs-toc text-sm text-zinc-400"
              dangerouslySetInnerHTML={{ __html: docToc }}
            />
          </nav>
        </aside>

        <article
          className="docs min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl sm:p-10 md:p-12 lg:rounded-[2rem]"
          ref={bodyRef}
          dangerouslySetInnerHTML={{ __html: docBody }}
        />
      </main>
    </div>
  );
}
