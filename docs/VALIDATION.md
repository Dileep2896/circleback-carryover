# Validation record

Validated locally on October 21, 2026 with Node.js 22 and pnpm 10.

| Check | Result |
| --- | --- |
| `pnpm test` | 28 passed across 9 files (re-verified by Claude Code, incl. 3 regression tests from review) |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed, no warnings |
| `pnpm build` | Passed; Next.js 15 production output generated |
| `PLAYWRIGHT_BROWSERS_PATH=.cache/playwright pnpm test:e2e` | 4 passed |
| Turbopack development routes | `/` and `/story` returned HTTP 200 |
| Seed metric | 31 raw items → 19 commitments; 2 updates; 2 stalls; 2 existing issues |
| Story component size | Every scene is below 120 lines |
| Credential pattern scan | No credential-shaped literals in source or `.env.example` |

Browser tests exercised provenance expansion, verdict filters, search/empty state, replay collapse, Linear confirmation, theme switching, historical API scoping, invalid requests, manual story navigation, and autoplay completion. No browser page errors or console errors occurred in the tested interactive flows. The autoplay run reached the final impact metric within 20 seconds.

Responsive checks passed at 320, 375, 414, and 768 CSS pixels. Light/dark desktop screenshots and reduced-motion mobile screenshots were inspected. Final selected images are in this directory; the full QA set is in ignored `.cache/qa/`.

The browser connector was unavailable. Local Chromium via Playwright performed the checks instead; Chromium required execution outside the macOS process sandbox. Development returned both pages successfully, though the host's file watcher limit emitted `EMFILE` warnings. Production and browser validation were unaffected; `WATCHPACK_POLLING=true pnpm dev` is available on hosts with restrictive watcher limits.

The database was reset after browser writes, so the supplied demo opens with the original two seeded Linear issues. No deployment, git push, or real external-service call was performed.
