# Assembly Services Portal — public portal

The citizen, business and property-owner portal for **Assembly Services Portal (ASP)** —
_The Digital Operating System for Ghana's District Assemblies._

Angular 22 + PrimeNG 22, standalone components, signals, reactive forms, SCSS.

> **This build is UI only.** There is no backend and no authentication server.
> Every screen runs off the mock data in `src/app/core/data`. Signing in or
> registering accepts anything and drops you straight into the dashboard;
> payments issue a receipt without money moving; uploads never leave the browser.
> Each screen says so where it matters, so nobody mistakes a demo for the real
> thing.

## Running it

```bash
npm install
npm start            # http://localhost:7420
```

Other commands:

```bash
npm run build        # production build into dist/
npm test             # Vitest smoke tests (see below)
npm run prettier     # format src/
```

## Routing

The portal is an application, not a content site — the public information pages
(about, services, how it works, FAQ, news, contact) live in the separate
`localis-website` repo. So the index page is the sign-in screen:

| Route | Page |
| --- | --- |
| `/` and `/login` | Sign in (any credentials work) |
| `/register` | Create an account — four account types |
| `/app/dashboard` | Summary tiles, quick actions, recent applications, activity, notifications, appointments |
| `/app/services` | Service catalogue, filtered by category and free text |
| `/app/services/:slug` | Service detail — description, eligibility, requirements, documents, fees, FAQs |
| `/app/services/:slug/apply` | Multi-step application wizard |
| `/app/applications` | All applications, filterable by status |
| `/app/applications/:id` | Timeline, documents, payment position, inspection, officer comments |
| `/app/payments` | Outstanding invoices, paid invoices, receipts |
| `/app/payments/pay/:id` | Mock payment — mobile money, card, bank transfer, POS, QR |
| `/app/payments/receipt/:id` | Printable receipt |
| `/app/documents` | Permits, certificates, receipts, letters and notices |
| `/app/appointments` | Inspections and meetings, as a list and a month calendar |
| `/app/notifications` | Notification timeline |
| `/app/messages` | Conversations with Assembly officers |
| `/app/profile` | Personal details, businesses, properties, security, notifications |
| `/app/help` | FAQs, support request form, contact details, mock live chat |
| `/app/settings` | Language, theme, accessibility, notifications |

Everything is lazily loaded. Route parameters arrive as signal inputs
(`withComponentInputBinding`).

## Structure

```
src/app/
  core/
    data/        mock data — services.data.ts (catalogue), mock.data.ts (everything else)
    models/      domain types, shaped the way a real API would return them
    services/    AuthService, PortalService, UiService, storage helpers
    guards/      authGuard / guestGuard
    theme/       asp-preset.ts — the PrimeNG preset
  layout/
    app-shell/   topbar, sidebar, speed dial
  features/      one folder per page
src/styles/
  _tokens.scss   CSS custom properties, kept in sync with the PrimeNG preset
```

**`PortalService` is the single source of state.** Everything is held in signals
seeded from `core/data`, and mutations update those signals in place — so filing
an application or settling an invoice moves the dashboard counters, the
applications table and the payments list together, exactly as a real backend
would. Swapping to HTTP later is a change to that one service, not a rewrite of
the components.

## Design

- **Colours** — Deep Blue `#0F4C81` primary, Green `#0E9F6E` secondary, Ghanaian
  gold `#C9A227` accent. Defined once in `core/theme/asp-preset.ts` (PrimeNG) and
  `styles/_tokens.scss` (our own CSS); keep the two in step.
- **Type** — Inter, with IBM Plex Sans and the system stack behind it.
- **Dark mode** — driven by the `.app-dark` class on `<html>`, toggled from the
  topbar or Settings, and remembered per device.
- **Accessibility** — skip link, visible focus, semantic landmarks, labelled
  fields, keyboard-operable tabs. Settings adds larger text, higher contrast and
  reduced motion; `prefers-reduced-motion` is honoured automatically.

## Tests

`src/app/app.smoke.spec.ts` mounts every page and asserts it renders. The build
already type-checks templates, so this covers what it cannot: PrimeNG component
APIs used wrongly at runtime, and anything a constructor or computed signal gets
wrong on first render. `src/test-setup.ts` stubs `ResizeObserver` and
`matchMedia`, which jsdom lacks and PrimeNG uses.

```bash
npm test    # 19 tests
```

## Wiring it to a real backend

1. Point `environment.baseUrl` at the API (`proxyconfig.json` already forwards
   `/api` to `http://localhost:8080/localis-api` for `ng serve`).
2. Replace the bodies of `PortalService` and `AuthService` with HTTP calls. The
   signals, computed values and component contracts stay as they are.
3. Set `environment.useMockData = false` and remove `core/data`.

## Known placeholders

- Contact details (`support@asp.gov.gh`, `+233 (0)30 200 0001`) are invented.
- The PrimeNG licence key in `environment.ts` is a community key; replace it with
  your own from https://primeui.dev/pricing.
- Language settings list Twi, Ewe and Hausa, but only English content exists —
  the UI says so rather than pretending otherwise.
