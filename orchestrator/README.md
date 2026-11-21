# OmniStack Orchestration Mind

An enterprise agentic orchestration system designed for a **Full-Stack Engineering Team**, equipped with **visual special effects**, **zero-trust active security**, the **strongest curated Model Context Protocol (MCP) servers**, and a **continuous auto-saving working mind** engine.

---

## 🌟 Key Architecture & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ⚡ OMNISTACK ORCHESTRATION MIND                      │
├────────────────────────────────────────────────────────────────────────┤
│  [ Visual Special Effects HUD ]  ⇄  [ Zero-Trust Security Perimeter ]  │
│  (ANSI Terminal FX & Dashboard)     (Redaction, Guardrails & RBAC)     │
├────────────────────────────────────────────────────────────────────────┤
│                 FULL-STACK MCP SUITE INTEGRATION                       │
│  • GitHub MCP         • PostgreSQL MCP     • Puppeteer MCP             │
│  • Docker MCP         • Sentry MCP         • Semgrep Security MCP      │
│  • Filesystem MCP     • Memory Knowledge Graph MCP                     │
├────────────────────────────────────────────────────────────────────────┤
│                   🧠 AUTO-SAVING WORKING MIND                          │
│  (Continuous Context Sync • Periodic Checkpoints • Crash Resumption)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. ✨ Special Effects & Visual Telemetry

* **Cyber-Neon HUD (`dashboard.html`):** An interactive visual dashboard featuring glassmorphic neon panels, real-time pulse indicators, live MCP latency meters, and an auto-save checkpoint log.
* **Animated Terminal Telemetry (`orchestration_mind.py`):** Real-time ASCII banner rendering, ANSI neon streaming effects (`CYAN`, `MAGENTA`, `PURPLE`), dynamic braille spinner animations, and instant status matrices.

---

## 2. 🛡️ Security Features (Zero-Trust Agentic Guard - ZTAG)

Defined in [`security_policy.json`](file:///d:/Talentechno/orchestrator/security_policy.json):

1. **Secret & Key Redaction Filter:**
   * Automatic real-time regex sanitization that scrubs GitHub PATs (`ghp_*`), AWS Access Keys (`AKIA*`), JWTs, Bearer tokens, and private keys from prompts, logs, and outputs.
2. **Command Guardrails & Workspace Jailing:**
   * Prohibits dangerous destructive commands (`rm -rf /`, `format`, shell injection pipes).
   * Confines file read/write operations strictly within the approved workspace root (`d:\Talentechno`).
3. **Role-Based Access Control (RBAC):**
   * **Lead Architect:** Full system synthesis & task delegation.
   * **Frontend Specialist:** Scoped to UI/DOM, TypeScript, and Puppeteer MCP.
   * **Backend Specialist:** Scoped to PostgreSQL, Docker, and API endpoints.
   * **Security Auditor:** Independent SAST analyzer with veto power over unsafe pull requests or shell executions.

---

## 3. 🛠️ The Strongest MCP Suite for Full-Stack Teams

Curated in [`mcp_fullstack_manifest.json`](file:///d:/Talentechno/orchestrator/mcp_fullstack_manifest.json):

| MCP Server | Domain | Primary Capabilities |
| :--- | :--- | :--- |
| **GitHub** | VCS / Code Review | Branch protection, PR management, collaborative code review |
| **PostgreSQL** | Relational Database | Schema inspection, automated migration planning, safe querying |
| **Puppeteer** | Frontend & E2E QA | Headless browser automation, DOM inspection, visual regression |
| **Docker** | Infrastructure | Container lifecycle, Dockerfile builds, compose orchestration |
| **Memory Graph** | Working Mind | Persistent entity/relation knowledge graph across agent sessions |
| **Secure Filesystem**| Local Workspace | Jailed filesystem operations with cryptographic checksums |
| **Sentry** | Observability | Real-time crash triaging, trace inspection, release telemetry |
| **Semgrep** | Application Security| Static application security testing (SAST), OWASP Top 10 |

---

## 4. 🧠 Auto-Saving Working Mind Engine

Implemented in `orchestration_mind.py`:

* **Continuous Checkpointing:** A background daemon thread periodically commits the active state graph (current sprint, agent thoughts, completed tasks, diffs) to `.orchestrator/working_mind_state.json`.
* **Historical Checkpoint Snapshots:** Automatically archives checkpoint snapshots (`chk_YYYYMMDD_HHMMSS.json`) in `.orchestrator/checkpoints/` so any session can be rolled back or resumed after a crash or server restart.
* **Resilient Working Mind:** Upon process start, the working mind automatically detects and restores the latest session state, guaranteeing zero context loss.

---

## 🚀 Running the Orchestration Mind

### Run Terminal Telemetry with Special Effects:
```powershell
python d:\Talentechno\orchestrator\orchestration_mind.py
```

### Open the Visual HUD:
Double click or open in your browser:
[dashboard.html](file:///d:/Talentechno/orchestrator/dashboard.html)

