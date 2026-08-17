import Image from "next/image";
import Link from "next/link";
import { ASCEND_LOGO_ASCII } from "./ascend-ascii";
import InstallButton from "./InstallButton";
import LoadingScreen from "./LoadingScreen";

export default function Home() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-black p-3 sm:p-4 md:p-6">
      <LoadingScreen />
      <section className="relative flex h-[calc(100vh-1.5rem)] w-full flex-col items-center overflow-hidden rounded-[2rem] border border-zinc-800 bg-black shadow-2xl sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <Image
          src="/ascii-art.png"
          alt="ASCII art background"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover opacity-80"
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/35 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-[2] flex items-start justify-center overflow-hidden pt-12 pointer-events-none select-none">
          <pre
            className="font-mono whitespace-pre leading-none text-white/[0.15] drop-shadow-2xl"
            style={{ fontSize: "min(0.5vw, 0.5vh)" }}
            aria-hidden="true"
          >
            {ASCEND_LOGO_ASCII}
          </pre>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
            Ascend
          </span>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl">
            Your daily{"\u2009"}
            <span className="shimmer-text">job search agent.</span>
          </h1>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-white drop-shadow-2xl sm:text-xl md:text-2xl">
            Run an agent once. It searches for jobs every day and adds the best
            matches to your list.
          </p>

          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <InstallButton />
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              documentation
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
              aria-label="GitHub repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.105 3.176.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.21 0 1.595-.015 2.877-.015 3.27 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
