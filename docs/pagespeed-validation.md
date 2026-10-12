# PageSpeed validation

The homepage previously loaded blocking CDN scripts/styles, the full application bundle, and decorative assets that returned 402/403. This change removes those requests, serves local fonts and SVG icons, renders public content without waiting for authentication, and loads app tools when needed. Hash navigation and the six sitemap URLs remain available.

## Measurements

| Category | Previous PageSpeed mobile | Previous PageSpeed desktop | Local mobile, all 3 runs | Local desktop, all 3 runs |
| --- | ---: | ---: | ---: | ---: |
| Performance | 87 | 98 | 99 | 100 |
| Accessibility | 81 | 72 | 100 | 100 |
| Best Practices | 96 | 96 | 100 | 100 |
| SEO | 92 | 92 | 100 | 100 |
| Agentic Browsing | 1/2 applicable checks | 1/2 applicable checks | 100 | 100 |

Measured October 12, 2026 with Lighthouse 13.5.0 and HeadlessChrome 153 against the production build served locally. Each run used a fresh browser profile; mobile used default simulated throttling and desktop used the desktop preset. The original baseline is the user's hosted PageSpeed report. Local and hosted network conditions differ, so these are pre-deployment results, not a claim about the deployed PageSpeed score. The local build does not contain production authentication configuration.

Mobile LCP was approximately 2.0 seconds; CLS and TBT were zero in all six runs. The main bundle is approximately 122 kB gzipped. Charts, dashboard, login, verification, public subroutes, date picker, uploads, recorder, legal dialog, and authentication are separate chunks. Network records confirm no initial dashboard/chart/date-picker/recording/upload/Dropbox SDK requests and no removed CDN/font/video/noise requests. Source maps resolve and contain no source contents. See [individual measurements](pagespeed/results.json).

## Validation

- `npm run build` passes. `npm run test:static` passes all six checks, including sitemap, canonical URLs, public content, removed CDN resources, deferred chunks, and source maps.
- App regression suite: 24 tests passed. The changed referral dialog and all six public documents were checked again after the final accessibility adjustment; 10 checks passed. No real account, upload, or transcript email was used.
- Browser checks covered all six public URLs at 390px and 1280px, correct headings/canonicals, and no horizontal overflow. Chapter search, empty results, referral URL cleanup, named controls, Escape dismissal, and focus restoration were checked.
- The browser's security policy blocked access to browser settings for disabling JavaScript. The generated HTML was instead checked with scripts unexecuted in jsdom; non-root public pages contain no scripts. A complete browser run with JavaScript disabled and a manual VoiceOver review remain follow-up checks.
- Local Vite uses MPA mode to return 404 for missing files, matching Pages rather than returning homepage HTML for missing optional AI files. WebMCP, `llms.txt`, and AI catalog integrations are not introduced.

## Screenshots

| Homepage, mobile | Referral dialog, mobile |
| --- | --- |
| ![Mobile homepage](pagespeed/home-mobile.jpg) | ![Named referral dialog](pagespeed/referral-mobile.jpg) |

[Desktop homepage](pagespeed/home-desktop.jpg) · [Static leadership page](pagespeed/leadership-mobile.jpg)

## Remaining hosting and diagnostic findings

GitHub Pages controls response cache lifetimes and does not provide repository-defined arbitrary response headers. Keep HTTPS enforcement and the current hosting configuration. Do not add a `_headers` file that Pages will ignore.

CSP, COOP, clickjacking protection, and Trusted Types require a separate hosting/edge configuration project. That project must inventory Firebase/Dropbox/API origins, begin CSP and Trusted Types in report-only mode, remediate violations without permissive catch-all policies, then enforce only after Google sign-in and Dropbox popup callbacks pass. Strict COOP can break OAuth popups; evaluate an authentication-compatible policy before deployment.

Do not enable HSTS `includeSubDomains` or preload until every subdomain has been audited for permanent HTTPS support. Third-party cache headers and SDK source maps are controlled by their vendors. The local preview's cache headers do not represent Pages cache behavior.

Some unscored Lighthouse diagnostics remain for shared React/Framer Motion JavaScript coverage, Firebase minification, the local stylesheet's render blocking, and request chains for deferred authentication. These do not affect the passing accessibility/SEO/best-practices checks; the initial third-party blocking resources and heavy private tools have been removed.

## After merge and deployment

1. Verify the six public URLs, local font/noise assets, sitemap, and source maps return the expected content on `www.tutordeck.org`.
2. Run hosted PageSpeed on mobile and desktop to record the actual deployed scores and cache/header diagnostics.
3. In Search Console, live-test `/leadership-registrar/`, confirm crawl/indexing permissions and its canonical, and request indexing if appropriate. Sitemap discovery and audit scores do not guarantee indexing or AI inclusion.
4. Check Google sign-in/session restoration and a test Dropbox connection in the deployed app. Production uploads and transcript emails were not exercised for this PR.
