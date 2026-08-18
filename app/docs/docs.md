# internship-bot Documentation

## Overview

`internship-bot` is a local agentic tool that finds software engineering internships for the summer of 2027, filters them to your preferred locations, and emails you a daily digest. Each digest listing has **Approve** and **Reject** buttons. Approved listings are added to a CSV spreadsheet you can use to track applications.

## What the bot does

1. **Scrapes** internship listings from public GitHub and JSON sources.
2. **Filters** them with a local LLM (Ollama) based on:
   - job title keywords
   - target season
   - target locations (Greater Toronto Area, California, New York City, etc.)
3. **Deduplicates** by company + role.
4. **Sends** an HTML email digest with Approve / Reject buttons.
5. **Queues** extra listings for the next day if you set a daily cap.
6. **Appends** approved listings to `data/internships.csv`.

## Requirements

- Python 3.11+
- [Ollama](https://ollama.com) with `qwen2.5:7b` pulled
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)
- Windows Task Scheduler (or cron on Linux/macOS) for automation
- Optional: `cloudflared` or `ngrok` to expose the local approve/reject server

## Installation

1. Open a terminal in the `internship-bot` folder.
2. Create a virtual environment (recommended):

   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install the package in editable mode:

   ```powershell
   pip install -e .
   ```

4. Pull the Ollama model:

   ```powershell
   ollama pull qwen2.5:7b
   ```

5. The first time you run `internship-bot` it will prompt you for settings and save them to `config/.env`. If you prefer to edit the file manually, copy the template:

   ```powershell
   Copy-Item config/.env.example config/.env
   ```

## First-time setup

The first time you run `internship-bot` or `internship-bot-manage`, it will ask for the settings it needs:

- Gmail address and App Password
- Ollama host and model
- Target job title keywords
- Target locations
- Target season
- Max listings per email
- Daily run time

Your answers are saved to `config/.env`, so the next run will not ask again.

If you prefer to configure it manually, copy the template and fill in the values:

```powershell
Copy-Item config/.env.example config/.env
```

At minimum you need:

| Variable | What to put |
|----------|-------------|
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASSWORD` | Your 16-character Gmail App Password (not your normal password) |
| `EMAIL_FROM` | Same as `SMTP_USER` |
| `EMAIL_TO` | The address where you want digests sent |
| `TUNNEL_BASE_URL` | Public URL for the approve/reject server (set this after exposing the server, see below) |

Optional but useful:

| Variable | Default | What it controls |
|----------|---------|------------------|
| `TARGET_ROLE_KEYWORDS` | `software,swe,engineer,ai,ml,machine learning,robotics` | Which job titles to keep |
| `TARGET_LOCATIONS` | `Greater Toronto Area,California,New York City` | Which locations to keep |
| `TARGET_SKILLS` | (empty) | Optional skills to prioritize (e.g. `python,c++,pytorch`) |
| `TARGET_SEASON` | `Summer 2027` | Internship season to look for |
| `MAX_DAILY_LISTINGS` | `25` | Max listings per email. `0` means no cap. Extra are queued. |
| `MAX_LLM_CALLS` | `0` | Max LLM calls per run. `0` means no cap. Use e.g. `300` to keep runs fast. |
| `OLLAMA_HOST` | `http://localhost:11434` | URL of the local Ollama server |
| `OLLAMA_MODEL` | `qwen2.5:7b` | Local LLM model used for filtering |
| `DAILY_RUN_TIME` | `09:00` | Time used when installing the scheduled task |
| `SCRAPE_SOURCE_URLS` | 17 built-in sources | Comma-separated URLs to scrape |

## Configuration with the terminal UI

Run the interactive settings manager:

```powershell
internship-bot-manage
```

You can also use:

```powershell
python manage.py
```

The UI lets you change all `.env` settings with arrow keys and prompts:

- Ollama host and model
- Job title keywords
- Target locations
- Target season
- Max listings per email
- Daily run time

You can also install the Windows scheduled task from this menu.

## Manual daily run

Run the full pipeline once. If this is the first time, it will ask for setup first:

```powershell
internship-bot
```

Dry run (scrape and render but do not send email):

```powershell
internship-bot --dry-run
```

Limit to the first N raw listings for a quick test:

```powershell
internship-bot --dry-run --limit 50
```

## How the workflow works

### 1. Data files

The bot creates and updates these files in `data/`:

- `pending.json` - listings in the most recent email that have not been approved or rejected
- `sent_log.json` - history of every listing that has been emailed, approved, rejected, or deferred
- `internships.csv` - the spreadsheet of approved listings

You can delete `data/sent_log.json` and `data/pending.json` if you ever want to force a fresh digest from scratch.

### 2. Daily cap and queue

If `MAX_DAILY_LISTINGS` is set (for example `25`), the bot sends at most that many listings and marks the rest as `deferred` in `sent_log.json`. The next day it combines fresh listings with deferred ones and sends up to the cap again, so nothing is lost.

`MAX_LLM_CALLS` controls how many listings the local LLM classifies per run. If you added a lot of sources and the run is too slow, set `MAX_LLM_CALLS=300` (or any number). `0` means no cap.

### 3. Approve and reject

The email has two buttons for each listing:

- **Approve** - adds the listing to `data/internships.csv` and removes it from `pending.json` 
- **Reject** - removes it from `pending.json` without adding to the CSV

For these buttons to work, the FastAPI server and a public tunnel must be running.

## Approve/Reject server setup

### 1. Start the local server

```powershell
uvicorn server.server:app --port 8000 --reload
```

### 2. Expose it to the internet

`internship-bot` will start a Cloudflare quick tunnel automatically before sending the email. If you prefer to start it manually:

Using Cloudflare Tunnel (recommended):

```powershell
cloudflared tunnel --url http://localhost:8000
```

If you do not have `cloudflared` installed, download `cloudflared.exe` and run:

```powershell
.\cloudflared.exe tunnel --url http://localhost:8000
```

Copy the `https://...trycloudflare.com` URL it prints and put it in `config/.env` as `TUNNEL_BASE_URL`.

If the tunnel is stopped and restarted, you will get a new URL. You must update `TUNNEL_BASE_URL` before the next `internship-bot` run, or the email buttons will be broken.

### 3. Test it

Open the public URL in a browser. You should see:

```
internship-bot is running
Use /approve?id=... or /reject?id=...
```

## Automation

The bot does **not** run automatically after installation. You must create a scheduled task.

### Option A: via the settings UI

1. Run `internship-bot-manage`.
2. Set `Daily run time` to when you want the email (e.g. `09:00`).
3. Select `Install Windows scheduled task` and confirm.
4. Approve the admin prompt if Windows asks.

### Option B: manually with schtasks

Open PowerShell as Administrator and run:

```powershell
schtasks /create /tn "internship-bot-daily" /tr "\"C:\Users\2024\Python\python.exe\" \"C:\VsCode\Agentic Job Search\run_daily.py\"" /sc daily /st 09:00 /f
```

Change the time (`09:00`) and the two paths to match your system.

### Important notes about automation

- The scheduled task only runs `internship-bot`. It does **not** start the FastAPI server or Cloudflare tunnel.
- For the email buttons to work, you still need the server and tunnel running. You can either leave them running in a terminal, create a second scheduled task for the server, or run them on startup.
- The bot uses your local Ollama model. Make sure Ollama is running before the scheduled task fires.

### Running the server automatically

You can also create a scheduled task for the server and tunnel, or a `.bat` file that starts both, but the simplest setup is to leave these two commands running in a terminal:

```powershell
# Terminal 1
uvicorn server.server:app --port 8000 --reload

# Terminal 2
.\cloudflared.exe tunnel --url http://localhost:8000
```

## Scraping sources

By default the bot scrapes:

- `SimplifyJobs/Summer2027-Internships` 
- `vanshb03/Summer2027-Internships` 
- `zshah101` automated 2027 internships JSON feed
- `ApplyGuy/2027-Internships` JSON feed
- `sndsh404/summer-2027-internships` 
- `speedyapply/2027-SWE-College-Jobs` 
- `speedyapply/2027-AI-College-Jobs` 
- `dreamworkhq/Tech-Internships-2027` 
- `sonak11/internatlas` — 700+ open Summer 2027 roles across categories
- `aprameyak/2027-tech-jobs` — large community list (also has New Grad and Off-Cycle sections)
- `SuryaHarikrishnan/internship-tracker` (SWE and Data/AI/ML listings)
- `jerrylin-23/2027-canada-internternships` 
- `zapplyjobs/Canada-Internships-2027` 
- `zapplyjobs/Internships-2027` 
- `negarprh/Canadian-Tech-Internships-2026` (`README-2027.md`)
- Hacker News "Who is hiring?" monthly thread (via `hn.algolia.com`)
- `Y Combinator` via `https://devasheeshg.github.io/yc-api/companies/hiring.json` — internship/co-op roles at YC startups

Optional extra sources:

- `speedyapply/2027-SWE-College-Jobs/INTERN_INTL.md` — international roles

If the run gets too slow, remove `sonak11/internatlas` and/or `aprameyak/2027-tech-jobs` or lower `MAX_LLM_CALLS`.

The Hacker News source is lightweight (two small Algolia requests) and adds startup roles that rarely appear on GitHub lists.

You can add or remove sources by editing `SCRAPE_SOURCE_URLS` in `config/.env` as a comma-separated list. The bot can handle:

- raw GitHub markdown READMEs
- HTML tables
- JSON feeds where the top level is a list of job objects

## Updating search filters

Edit `.env` directly or use `internship-bot-manage`.

Examples of `TARGET_ROLE_KEYWORDS`:

```
software,swe,engineer,developer,data,backend,frontend,fullstack,ml,robotics
```

Examples of `TARGET_LOCATIONS`:

```
Greater Toronto Area,California,New York City
```

The location filter is case-insensitive and understands common aliases (e.g. `SF`, `NYC`, `Bay Area`, `GTA`).

## Deduplication

The bot removes duplicate listings where **company + role** are the same, ignoring season suffixes like `- Summer 2027`. Two roles at the same company with different team names (for example `Software Engineer Intern - Payments` and `Software Engineer Intern - Infrastructure`) are kept as separate listings.

## Commands reference

| Command | What it does |
|---------|--------------|
| `internship-bot` | Scrape, filter, and send the daily digest (starts the server/tunnel if needed) |
| `internship-bot --dry-run` | Scrape and render, do not send email |
| `internship-bot --limit 30` | Only process the first 30 raw listings |
| `internship-bot-manage` | Open the settings UI |
| `uvicorn server.server:app --port 8000 --reload` | Start the approve/reject server |
| `cloudflared tunnel --url http://localhost:8000` | Expose the server publicly |
| `python run_daily.py` | Same as `internship-bot` |
| `python manage.py` | Same as `internship-bot-manage` |

## Troubleshooting

### Email buttons go to a broken link

`TUNNEL_BASE_URL` in `config/.env` is wrong or expired. Restart the tunnel, copy the new public URL, update `.env`, and re-run `internship-bot`.

### Ollama errors

Make sure Ollama is running:

```powershell
ollama serve
```

And the model is pulled:

```powershell
ollama pull qwen2.5:7b
```

To switch models, run `internship-bot-manage` and select `Ollama model`.

### No listings are found

- Check `TARGET_ROLE_KEYWORDS` in `config/.env`.
- Check `TARGET_LOCATIONS`.
- Try a dry run with `--limit 50` to see what the LLM is filtering out.

### Scheduled task is not running

- Open Task Scheduler and check the `internship-bot-daily` task.
- Make sure the task runs under your user account.
- The task may need to run whether the user is logged on or not.
- Make sure the Ollama server is running before the task fires.

### The CSV has duplicate rows

`data/internships.csv` is checked for duplicate IDs before appending, so this normally should not happen. If it does, you can safely delete duplicate rows from the CSV.
