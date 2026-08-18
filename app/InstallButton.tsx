"use client";

import { useEffect, useRef, useState } from "react";

const WindowsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M0 3.449l9.75-1.43v9.463l-9.75-.154V3.449zm9.75 8.668l-.001 9.439L0 20.713v-8.92l9.75.324zm1.5-10.183l12.251-1.795v11.397l-12.251.206V1.934zm12.251 10.878l-.001 11.467L11.25 25.223v-11.79l12.251.379z" />
  </svg>
);

const MacIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 4.55c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.21-1.17.41-2.35 1.05-3.11z" />
  </svg>
);

const options = [
  {
    label: "Windows",
    icon: WindowsIcon,
    command:
      "python -m venv .venv && .venv\\Scripts\\activate.bat && pip install -e . && copy config\\.env.example config\\.env && internship-bot",
  },
  {
    label: "macOS",
    icon: MacIcon,
    command: `# 1. Get the code\ngit clone https://github.com/gurshaan1124/internship-bot.git\ncd internship-bot\n\n# 2. Make a virtual environment\npython3 -m venv .venv\nsource .venv/bin/activate\n\n# 3. Install the bot and its Python dependencies\npip install -e .\n\n# 4. Install the Cloudflare tunnel tool\nbrew install cloudflared\n\n# 5. Run it (first run starts the setup wizard)\ninternship-bot`,
  },
];

export default function InstallButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const copy = async (label: string, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(label);
      setTimeout(() => {
        setCopied(null);
        setOpen(false);
      }, 800);
    } catch {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="liquid-glass inline-block rounded-full px-8 py-3 text-base font-semibold text-white"
      >
        <span className="relative z-10">install</span>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-1.5 shadow-2xl backdrop-blur-xl">
          {options.map(({ label, icon: Icon, command }) => (
            <button
              key={label}
              type="button"
              onClick={() => copy(label, command)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
              <Icon />
              {copied === label ? "Copied!" : label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
