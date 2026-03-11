# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SISPROJ-SAES-2026 is an internal dashboard system for **CGPROJ/SAES — Ministério da Saúde** (Brazil's Ministry of Health). It provides interactive analytical panels for project tracking, financial execution, and personnel management.

## Architecture

This is a **static site with no build system** — all pages are standalone, self-contained HTML files with inline CSS and JavaScript. There is no framework, bundler, package manager, or test suite.

### Key Files

- **`index.html`** — Landing page / portal. Lists all available panels as cards. Contains a `PANELS` array in a `<script>` block that registers each dashboard (id, title, file path, status, tags). To add a new panel, add an entry to this array. Some panels are password-protected (modal with client-side auth).
- **`painel_ponto_v2.html`** (~2.4 MB) — Time tracking dashboard (Pontomais data). Large file with embedded data.
- **`opas.html`** (~428 KB) — OPAS/WHO financial execution dashboard (TC-105, multiple TAs).
- **`ted.html`** (~493 KB) — TED (Termos de Execução Descentralizada) tracking panel.
- **`painel_pronon.html`** (~182 KB) — PRONON oncology program dashboard.

### Patterns

- Each dashboard HTML file is fully self-contained: styles in `<style>`, logic in `<script>`, data embedded inline.
- Dark theme UI with CSS custom properties (`:root` variables) per page — each panel has its own color scheme.
- Language: all user-facing text is in **Brazilian Portuguese (pt-BR)**.
- No external JS libraries — all vanilla JavaScript.
- Data is hardcoded/embedded directly in the HTML files (no API calls or external data sources).

## Development

- **No build/lint/test commands** — open HTML files directly in a browser.
- Files can be very large (painel_ponto_v2.html is ~2.4 MB) due to embedded data. Use offset/limit when reading.
- When editing, preserve the existing code style: compact/minified CSS, inline everything.
- Commit messages have been written in both Portuguese and English — either is acceptable.
