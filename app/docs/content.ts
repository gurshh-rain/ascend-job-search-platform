export const docBody = `<h1 id="internship-bot-documentation">internship-bot Documentation</h1>
<h2 id="overview">Overview</h2>
<p><code>internship-bot</code> is a local agentic tool that finds software engineering internships for the summer of 2027, filters them to your preferred locations, and emails you a daily digest. Each digest listing has <strong>Approve</strong> and <strong>Reject</strong> buttons. Approved listings are added to a CSV spreadsheet you can use to track applications.</p>
<h2 id="what-the-bot-does">What the bot does</h2>
<ol>
<li><strong>Scrapes</strong> internship listings from public GitHub and JSON sources.</li>
<li><strong>Filters</strong> them with a local LLM (Ollama) based on:<ul>
<li>job title keywords</li>
<li>target season</li>
<li>target locations (Greater Toronto Area, California, New York City, etc.)</li>
</ul>
</li>
<li><strong>Deduplicates</strong> by company + role.</li>
<li><strong>Sends</strong> an HTML email digest with Approve / Reject buttons.</li>
<li><strong>Queues</strong> extra listings for the next day if you set a daily cap.</li>
<li><strong>Appends</strong> approved listings to <code>data/internships.csv</code>.</li>
</ol>
<h2 id="requirements">Requirements</h2>
<ul>
<li>Python 3.11+</li>
<li><a href="https://ollama.com">Ollama</a> with <code>qwen2.5:7b</code> pulled</li>
<li>A Gmail account with an <a href="https://myaccount.google.com/apppasswords">App Password</a></li>
<li>Windows Task Scheduler (or cron on Linux/macOS) for automation</li>
<li>Optional: <code>cloudflared</code> or <code>ngrok</code> to expose the local approve/reject server</li>
</ul>
<h2 id="installation">Installation</h2>
<h3 id="windows">Windows</h3>
<ol>
<li>Open a terminal in the <code>internship-bot</code> folder.</li>
<li>
<p>Create a virtual environment (recommended):</p>
<div class="code-block"><pre><span></span><code><span class="n">python</span> <span class="n">-m</span> <span class="n">venv</span> <span class="p">.</span><span class="n">venv</span>
<span class="p">.</span><span class="n">venv</span><span class="p">\\</span><span class="n">Scripts</span><span class="p">\\</span><span class="n">activate</span>
</code></pre></div>
</li>
<li>
<p>Install the package in editable mode:</p>
<div class="code-block"><pre><span></span><code><span class="n">pip</span> <span class="n">install</span> <span class="n">-e</span> <span class="p">.</span>
</code></pre></div>
</li>
<li>
<p>Pull the Ollama model:</p>
<div class="code-block"><pre><span></span><code><span class="n">ollama</span> <span class="n">pull</span> <span class="n">qwen2</span><span class="p">.</span><span class="n">5</span><span class="p">:</span><span class="n">7b</span>
</code></pre></div>
</li>
<li>
<p>Copy the environment template:</p>
<div class="code-block"><pre><span></span><code><span class="nb">Copy-Item</span> <span class="n">config</span><span class="p">/.</span><span class="n">env</span><span class="p">.</span><span class="n">example</span> <span class="n">config</span><span class="p">/.</span><span class="n">env</span>
</code></pre></div>
</li>
</ol>
<h3 id="macos">macOS</h3>
<ol>
<li>Open a terminal in the <code>internship-bot</code> folder.</li>
<li>
<p>Create a virtual environment (recommended):</p>
<div class="code-block"><pre><span></span><code>python3<span class="w"> </span>-m<span class="w"> </span>venv<span class="w"> </span>.venv
<span class="nb">source</span><span class="w"> </span>.venv/bin/activate
</code></pre></div>
</li>
<li>
<p>Install the package in editable mode:</p>
<div class="code-block"><pre><span></span><code>pip3<span class="w"> </span>install<span class="w"> </span>-e<span class="w"> </span>.
</code></pre></div>
</li>
<li>
<p>Pull the Ollama model:</p>
<div class="code-block"><pre><span></span><code>ollama<span class="w"> </span>pull<span class="w"> </span>qwen2.5:7b
</code></pre></div>
</li>
<li>
<p>Copy the environment template:</p>
<div class="code-block"><pre><span></span><code>cp<span class="w"> </span>config/.env.example<span class="w"> </span>config/.env
</code></pre></div>
</li>
</ol>
<h2 id="first-time-setup">First-time setup</h2>
<p>Edit <code>config/.env</code> and fill in at least these values:</p>
<table>
<thead>
<tr>
<th>Variable</th>
<th>What to put</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>SMTP_USER</code></td>
<td>Your Gmail address</td>
</tr>
<tr>
<td><code>SMTP_PASSWORD</code></td>
<td>Your 16-character Gmail App Password (not your normal password)</td>
</tr>
<tr>
<td><code>EMAIL_FROM</code></td>
<td>Same as <code>SMTP_USER</code></td>
</tr>
<tr>
<td><code>EMAIL_TO</code></td>
<td>The address where you want digests sent</td>
</tr>
<tr>
<td><code>TUNNEL_BASE_URL</code></td>
<td>Public URL for the approve/reject server (set this after exposing the server, see below)</td>
</tr>
</tbody>
</table>
<p>Optional but useful:</p>
<table>
<thead>
<tr>
<th>Variable</th>
<th>Default</th>
<th>What it controls</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>TARGET_ROLE_KEYWORDS</code></td>
<td><code>software,swe,engineer,ai,ml,machine learning,robotics</code></td>
<td>Which job titles to keep</td>
</tr>
<tr>
<td><code>TARGET_LOCATIONS</code></td>
<td><code>Greater Toronto Area,California,New York City</code></td>
<td>Which locations to keep</td>
</tr>
<tr>
<td><code>TARGET_SKILLS</code></td>
<td>(empty)</td>
<td>Optional skills to prioritize (e.g. <code>python,c++,pytorch</code>)</td>
</tr>
<tr>
<td><code>TARGET_SEASON</code></td>
<td><code>Summer 2027</code></td>
<td>Internship season to look for</td>
</tr>
<tr>
<td><code>MAX_DAILY_LISTINGS</code></td>
<td><code>25</code></td>
<td>Max listings per email. <code>0</code> means no cap. Extra are queued.</td>
</tr>
<tr>
<td><code>MAX_LLM_CALLS</code></td>
<td><code>0</code></td>
<td>Max LLM calls per run. <code>0</code> means no cap. Use e.g. <code>300</code> to keep runs fast.</td>
</tr>
<tr>
<td><code>DAILY_RUN_TIME</code></td>
<td><code>09:00</code></td>
<td>Time used when installing the scheduled task</td>
</tr>
<tr>
<td><code>SCRAPE_SOURCE_URLS</code></td>
<td>4 built-in sources</td>
<td>Comma-separated URLs to scrape</td>
</tr>
</tbody>
</table>
<h2 id="configuration-with-the-terminal-ui">Configuration with the terminal UI</h2>
<p>Run the interactive settings manager:</p>
<div class="code-block"><pre><span></span><code><span class="n">internship-bot-manage</span>
</code></pre></div>
<p>You can also use:</p>
<div class="code-block"><pre><span></span><code><span class="n">python</span> <span class="n">manage</span><span class="p">.</span><span class="n">py</span>
</code></pre></div>
<p>The UI lets you change all <code>.env</code> settings with arrow keys and prompts:</p>
<ul>
<li>Job title keywords</li>
<li>Target locations</li>
<li>Target season</li>
<li>Max listings per email</li>
<li>Daily run time</li>
</ul>
<p>You can also install the Windows scheduled task from this menu.</p>
<h2 id="manual-daily-run">Manual daily run</h2>
<p>Run the full pipeline once:</p>
<div class="code-block"><pre><span></span><code><span class="n">internship-bot</span>
</code></pre></div>
<p>Dry run (scrape and render but do not send email):</p>
<div class="code-block"><pre><span></span><code><span class="n">internship-bot</span> <span class="p">-</span><span class="n">-dry-run</span>
</code></pre></div>
<p>Limit to the first N raw listings for a quick test:</p>
<div class="code-block"><pre><span></span><code><span class="n">internship-bot</span> <span class="p">-</span><span class="n">-dry-run</span> <span class="p">-</span><span class="n">-limit</span> <span class="n">50</span>
</code></pre></div>
<h2 id="how-the-workflow-works">How the workflow works</h2>
<h3 id="1-data-files">1. Data files</h3>
<p>The bot creates and updates these files in <code>data/</code>:</p>
<ul>
<li><code>pending.json</code> - listings in the most recent email that have not been approved or rejected</li>
<li><code>sent_log.json</code> - history of every listing that has been emailed, approved, rejected, or deferred</li>
<li><code>internships.csv</code> - the spreadsheet of approved listings</li>
</ul>
<p>You can delete <code>data/sent_log.json</code> and <code>data/pending.json</code> if you ever want to force a fresh digest from scratch.</p>
<h3 id="2-daily-cap-and-queue">2. Daily cap and queue</h3>
<p>If <code>MAX_DAILY_LISTINGS</code> is set (for example <code>25</code>), the bot sends at most that many listings and marks the rest as <code>deferred</code> in <code>sent_log.json</code>. The next day it combines fresh listings with deferred ones and sends up to the cap again, so nothing is lost.</p>
<p><code>MAX_LLM_CALLS</code> controls how many listings the local LLM classifies per run. If you added a lot of sources and the run is too slow, set <code>MAX_LLM_CALLS=300</code> (or any number). <code>0</code> means no cap.</p>
<h3 id="3-approve-and-reject">3. Approve and reject</h3>
<p>The email has two buttons for each listing:</p>
<ul>
<li><strong>Approve</strong> - adds the listing to <code>data/internships.csv</code> and removes it from <code>pending.json</code> </li>
<li><strong>Reject</strong> - removes it from <code>pending.json</code> without adding to the CSV</li>
</ul>
<p>For these buttons to work, the FastAPI server and a public tunnel must be running.</p>
<h2 id="approvereject-server-setup">Approve/Reject server setup</h2>
<h3 id="1-start-the-local-server">1. Start the local server</h3>
<div class="code-block"><pre><span></span><code><span class="n">uvicorn</span> <span class="n">server</span><span class="p">.</span><span class="n">server</span><span class="p">:</span><span class="n">app</span> <span class="p">-</span><span class="n">-port</span> <span class="n">8000</span> <span class="p">-</span><span class="n">-reload</span>
</code></pre></div>
<h3 id="2-expose-it-to-the-internet">2. Expose it to the internet</h3>
<p>Using Cloudflare Tunnel (recommended):</p>
<div class="code-block"><pre><span></span><code><span class="n">cloudflared</span> <span class="n">tunnel</span> <span class="p">-</span><span class="n">-url</span> <span class="n">http</span><span class="p">://</span><span class="n">localhost</span><span class="p">:</span><span class="n">8000</span>
</code></pre></div>
<p>If you do not have <code>cloudflared</code> installed, download <code>cloudflared.exe</code> and run:</p>
<div class="code-block"><pre><span></span><code><span class="p">.\\</span><span class="n">cloudflared</span><span class="p">.</span><span class="n">exe</span> <span class="n">tunnel</span> <span class="p">-</span><span class="n">-url</span> <span class="n">http</span><span class="p">://</span><span class="n">localhost</span><span class="p">:</span><span class="n">8000</span>
</code></pre></div>
<p>Copy the <code>https://...trycloudflare.com</code> URL it prints and put it in <code>config/.env</code> as <code>TUNNEL_BASE_URL</code>.</p>
<p>If the tunnel is stopped and restarted, you will get a new URL. You must update <code>TUNNEL_BASE_URL</code> before the next <code>internship-bot</code> run, or the email buttons will be broken.</p>
<h3 id="3-test-it">3. Test it</h3>
<p>Open the public URL in a browser. You should see:</p>
<div class="code-block"><pre><span></span><code>internship-bot is running
Use /approve?id=... or /reject?id=...
</code></pre></div>
<h2 id="automation">Automation</h2>
<p>The bot does <strong>not</strong> run automatically after installation. You must create a scheduled task.</p>
<h3 id="option-a-via-the-settings-ui">Option A: via the settings UI</h3>
<ol>
<li>Run <code>internship-bot-manage</code>.</li>
<li>Set <code>Daily run time</code> to when you want the email (e.g. <code>09:00</code>).</li>
<li>Select <code>Install Windows scheduled task</code> and confirm.</li>
<li>Approve the admin prompt if Windows asks.</li>
</ol>
<h3 id="option-b-manually-with-schtasks">Option B: manually with schtasks</h3>
<p>Open PowerShell as Administrator and run:</p>
<div class="code-block"><pre><span></span><code><span class="n">schtasks</span> <span class="p">/</span><span class="n">create</span> <span class="p">/</span><span class="n">tn</span> <span class="s2">&quot;internship-bot-daily&quot;</span> <span class="p">/</span><span class="n">tr</span> <span class="s2">&quot;\\&quot;</span><span class="n">C</span><span class="p">:\\</span><span class="n">Users</span><span class="p">\\</span><span class="n">2024</span><span class="p">\\</span><span class="n">Python</span><span class="p">\\</span><span class="n">python</span><span class="p">.</span><span class="n">exe</span><span class="p">\\</span><span class="s2">&quot; \\&quot;</span><span class="n">C</span><span class="p">:\\</span><span class="n">VsCode</span><span class="p">\\</span><span class="n">Agentic</span> <span class="n">Job</span> <span class="n">Search</span><span class="p">\\</span><span class="n">run_daily</span><span class="p">.</span><span class="n">py</span><span class="p">\\</span><span class="s2">&quot;&quot;</span> <span class="p">/</span><span class="nb">sc </span><span class="n">daily</span> <span class="p">/</span><span class="n">st</span> <span class="n">09</span><span class="p">:</span><span class="n">00</span> <span class="p">/</span><span class="n">f</span>
</code></pre></div>
<p>Change the time (<code>09:00</code>) and the two paths to match your system.</p>
<h3 id="important-notes-about-automation">Important notes about automation</h3>
<ul>
<li>The scheduled task only runs <code>internship-bot</code>. It does <strong>not</strong> start the FastAPI server or Cloudflare tunnel.</li>
<li>For the email buttons to work, you still need the server and tunnel running. You can either leave them running in a terminal, create a second scheduled task for the server, or run them on startup.</li>
<li>The bot uses your local Ollama model. Make sure Ollama is running before the scheduled task fires.</li>
</ul>
<h3 id="running-the-server-automatically">Running the server automatically</h3>
<p>You can also create a scheduled task for the server and tunnel, or a <code>.bat</code> file that starts both, but the simplest setup is to leave these two commands running in a terminal:</p>
<div class="code-block"><pre><span></span><code><span class="c"># Terminal 1</span>
<span class="n">uvicorn</span> <span class="n">server</span><span class="p">.</span><span class="n">server</span><span class="p">:</span><span class="n">app</span> <span class="p">-</span><span class="n">-port</span> <span class="n">8000</span> <span class="p">-</span><span class="n">-reload</span>

<span class="c"># Terminal 2</span>
<span class="p">.\\</span><span class="n">cloudflared</span><span class="p">.</span><span class="n">exe</span> <span class="n">tunnel</span> <span class="p">-</span><span class="n">-url</span> <span class="n">http</span><span class="p">://</span><span class="n">localhost</span><span class="p">:</span><span class="n">8000</span>
</code></pre></div>
<h2 id="scraping-sources">Scraping sources</h2>
<p>By default the bot scrapes:</p>
<ul>
<li><code>SimplifyJobs/Summer2027-Internships</code> </li>
<li><code>vanshb03/Summer2027-Internships</code> </li>
<li><code>zshah101</code> automated 2027 internships JSON feed</li>
<li><code>ApplyGuy/2027-Internships</code> JSON feed</li>
<li><code>sndsh404/summer-2027-internships</code> </li>
<li><code>speedyapply/2027-SWE-College-Jobs</code> </li>
<li><code>dreamworkhq/Tech-Internships-2027</code> </li>
<li><code>Y Combinator</code> via <code>https://devasheeshg.github.io/yc-api/companies/hiring.json</code> — internship/co-op roles at YC startups</li>
</ul>
<p>Optional extra sources (larger / slower):</p>
<ul>
<li><code>aprameyak/2027-tech-jobs</code> — large community list with New Grad and Off-Cycle sections</li>
<li><code>speedyapply/2027-SWE-College-Jobs/INTERN_INTL.md</code> — international roles</li>
</ul>
<p>You can add or remove sources by editing <code>SCRAPE_SOURCE_URLS</code> in <code>config/.env</code> as a comma-separated list. The bot can handle:</p>
<ul>
<li>raw GitHub markdown READMEs</li>
<li>HTML tables</li>
<li>JSON feeds where the top level is a list of job objects</li>
</ul>
<h2 id="updating-search-filters">Updating search filters</h2>
<p>Edit <code>.env</code> directly or use <code>internship-bot-manage</code>.</p>
<p>Examples of <code>TARGET_ROLE_KEYWORDS</code>:</p>
<div class="code-block"><pre><span></span><code>software,swe,engineer,developer,data,backend,frontend,fullstack,ml,robotics
</code></pre></div>
<p>Examples of <code>TARGET_LOCATIONS</code>:</p>
<div class="code-block"><pre><span></span><code>Greater Toronto Area,California,New York City
</code></pre></div>
<p>The location filter is case-insensitive and understands common aliases (e.g. <code>SF</code>, <code>NYC</code>, <code>Bay Area</code>, <code>GTA</code>).</p>
<h2 id="deduplication">Deduplication</h2>
<p>The bot removes duplicate listings where <strong>company + role</strong> are the same, ignoring season suffixes like <code>- Summer 2027</code>. Two roles at the same company with different team names (for example <code>Software Engineer Intern - Payments</code> and <code>Software Engineer Intern - Infrastructure</code>) are kept as separate listings.</p>
<h2 id="commands-reference">Commands reference</h2>
<table>
<thead>
<tr>
<th>Command</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>internship-bot</code></td>
<td>Scrape, filter, and send the daily digest</td>
</tr>
<tr>
<td><code>internship-bot --dry-run</code></td>
<td>Scrape and render, do not send email</td>
</tr>
<tr>
<td><code>internship-bot --limit 30</code></td>
<td>Only process the first 30 raw listings</td>
</tr>
<tr>
<td><code>internship-bot-manage</code></td>
<td>Open the settings UI</td>
</tr>
<tr>
<td><code>uvicorn server.server:app --port 8000 --reload</code></td>
<td>Start the approve/reject server</td>
</tr>
<tr>
<td><code>cloudflared tunnel --url http://localhost:8000</code></td>
<td>Expose the server publicly</td>
</tr>
<tr>
<td><code>python run_daily.py</code></td>
<td>Same as <code>internship-bot</code></td>
</tr>
<tr>
<td><code>python manage.py</code></td>
<td>Same as <code>internship-bot-manage</code></td>
</tr>
</tbody>
</table>
<h2 id="troubleshooting">Troubleshooting</h2>
<h3 id="email-buttons-go-to-a-broken-link">Email buttons go to a broken link</h3>
<p><code>TUNNEL_BASE_URL</code> in <code>config/.env</code> is wrong or expired. Restart the tunnel, copy the new public URL, update <code>.env</code>, and re-run <code>internship-bot</code>.</p>
<h3 id="ollama-errors">Ollama errors</h3>
<p>Make sure Ollama is running:</p>
<div class="code-block"><pre><span></span><code><span class="n">ollama</span> <span class="n">serve</span>
</code></pre></div>
<p>And the model is pulled:</p>
<div class="code-block"><pre><span></span><code><span class="n">ollama</span> <span class="n">pull</span> <span class="n">qwen2</span><span class="p">.</span><span class="n">5</span><span class="p">:</span><span class="n">7b</span>
</code></pre></div>
<h3 id="no-listings-are-found">No listings are found</h3>
<ul>
<li>Check <code>TARGET_ROLE_KEYWORDS</code> in <code>config/.env</code>.</li>
<li>Check <code>TARGET_LOCATIONS</code>.</li>
<li>Try a dry run with <code>--limit 50</code> to see what the LLM is filtering out.</li>
</ul>
<h3 id="scheduled-task-is-not-running">Scheduled task is not running</h3>
<ul>
<li>Open Task Scheduler and check the <code>internship-bot-daily</code> task.</li>
<li>Make sure the task runs under your user account.</li>
<li>The task may need to run whether the user is logged on or not.</li>
<li>Make sure the Ollama server is running before the task fires.</li>
</ul>
<h3 id="the-csv-has-duplicate-rows">The CSV has duplicate rows</h3>
<p><code>data/internships.csv</code> is checked for duplicate IDs before appending, so this normally should not happen. If it does, you can safely delete duplicate rows from the CSV.</p>`;

export const docToc = `<nav class="toc"><div class="toc">
<ul>
<li><a href="#internship-bot-documentation">internship-bot Documentation</a><ul>
<li><a href="#overview">Overview</a></li>
<li><a href="#what-the-bot-does">What the bot does</a></li>
<li><a href="#requirements">Requirements</a></li>
<li><a href="#installation">Installation</a><ul>
<li><a href="#windows">Windows</a></li>
<li><a href="#macos">macOS</a></li>
</ul>
</li>
<li><a href="#first-time-setup">First-time setup</a></li>
<li><a href="#configuration-with-the-terminal-ui">Configuration with the terminal UI</a></li>
<li><a href="#manual-daily-run">Manual daily run</a></li>
<li><a href="#how-the-workflow-works">How the workflow works</a><ul>
<li><a href="#1-data-files">1. Data files</a></li>
<li><a href="#2-daily-cap-and-queue">2. Daily cap and queue</a></li>
<li><a href="#3-approve-and-reject">3. Approve and reject</a></li>
</ul>
</li>
<li><a href="#approvereject-server-setup">Approve/Reject server setup</a><ul>
<li><a href="#1-start-the-local-server">1. Start the local server</a></li>
<li><a href="#2-expose-it-to-the-internet">2. Expose it to the internet</a></li>
<li><a href="#3-test-it">3. Test it</a></li>
</ul>
</li>
<li><a href="#automation">Automation</a><ul>
<li><a href="#option-a-via-the-settings-ui">Option A: via the settings UI</a></li>
<li><a href="#option-b-manually-with-schtasks">Option B: manually with schtasks</a></li>
<li><a href="#important-notes-about-automation">Important notes about automation</a></li>
<li><a href="#running-the-server-automatically">Running the server automatically</a></li>
</ul>
</li>
<li><a href="#scraping-sources">Scraping sources</a></li>
<li><a href="#updating-search-filters">Updating search filters</a></li>
<li><a href="#deduplication">Deduplication</a></li>
<li><a href="#commands-reference">Commands reference</a></li>
<li><a href="#troubleshooting">Troubleshooting</a><ul>
<li><a href="#email-buttons-go-to-a-broken-link">Email buttons go to a broken link</a></li>
<li><a href="#ollama-errors">Ollama errors</a></li>
<li><a href="#no-listings-are-found">No listings are found</a></li>
<li><a href="#scheduled-task-is-not-running">Scheduled task is not running</a></li>
<li><a href="#the-csv-has-duplicate-rows">The CSV has duplicate rows</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</nav>`;
