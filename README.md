# Ren Rental

Ren Rental is a React web application for presenting self-drive rental options and supporting the rental team's billing workflow.

Production site: <https://ren-rental.pages.dev/>

## What the project does

- Presents the Ren Rental fleet, rental experience, self-drive packages, and contact/enquiry information.
- Lets visitors enquire or reserve through WhatsApp and reach the team through the configured social and email links.
- Provides an admin login flow and a billing workspace for recording rental, customer, vehicle, payment, and dispatch details.
- Calculates rental duration, charges, discounts, tax, paid amounts, and balance due from the billing form.
- Shows a read-only bill preview and opens the browser print dialog to print or save the bill as a PDF.
- Saves a billing draft to the current browser's local storage when **Save Draft** is used.

## Tech stack

- React 19
- Vite 8
- Tailwind CSS 4 with the Vite plugin
- Sass stylesheets

## Run locally

### Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

### Install and start the development server

From the project root, run:

```powershell
npm install
npm run dev
```

Vite prints the local URL in the terminal (usually <http://localhost:5173/>). Open that URL in a browser. Changes are served with Vite's development hot reload.

### Other project commands

```powershell
npm run lint
npm run build
npm run preview
```

- `npm run lint` checks the project with ESLint.
- `npm run build` creates the production site in `dist/`.
- `npm run preview` serves the production build locally; run it after `npm run build`.

## Main routes and source folders

- `/` - public rental landing page.
- `/admin/login` - admin login screen, opened by pressing and holding the landing-page logo for 3-5 seconds.
- `/admin/reservations` - Reservations workspace.
- `/admin/billing` - Billing & Invoices workspace, opened after successful admin login.
- `/admin/setting` - Settings workspace.
- `src/pages/home/` - public landing page and its styles.
- `src/pages/home/home-content.json` - Home page feature cards, plans, and policy notes.
- `src/pages/admin/` - admin login and its styles.
- `src/pages/billing/` - billing form, bill preview, and print styles.
- `src/pages/billing/billing-content.json` - Billing navigation, charge types, dispatch checks, billing schemes, and invoice links.
- `public/` - static assets copied into the production build.

The admin access state is currently held in browser `sessionStorage`; there is no server-side authentication or backend/API integration. Billing drafts are saved only in the current browser and are not synced to a server or automatically restored into the form.
Reservations and Settings currently display introductory placeholder text; the billing route contains the working invoice workflow.

## Brochure asset

The landing page's **BROCHURE** action downloads `public/images/broucher.png`. `public/Ren-Rental-Brochure.pdf` is not referenced by the application code, but Vite copies it into the production output, where it is available as `/Ren-Rental-Brochure.pdf`.
