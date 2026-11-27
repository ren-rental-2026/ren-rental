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

## Callback email setup

The callback form sends its email through the EmailJS browser SDK. Create an EmailJS service and template. Set the template's **To Email** to the fixed Ren Rental address `ren.rental.2026@gmail.com`; do not make the recipient depend on a visitor-provided template variable. Include these template variables:

- `vehicle_name`
- `preferred_travel_date`
- `customer_mobile`
- `customer_name`
- `customer_email`
- `message`

Copy `.env.example` to `.env.local` and fill in the service ID, template ID, and public key from EmailJS. For production, also set these three variables in the Cloudflare Pages build environment and redeploy. These Vite values are public in the browser bundle; never put an EmailJS private key or mail password in them. Restrict the EmailJS service to the production site domain and configure account-level abuse limits in the EmailJS dashboard. The SDK's client-side rate limit is only an additional safeguard and can be bypassed; this browser-only setup cannot provide server-enforced abuse protection.

Submitting starts the email request and opens WhatsApp with the same request details, including the preferred travel date and any name, mobile number, and email the visitor provided. These details are included in the WhatsApp URL and shared with WhatsApp when opened. The visitor still needs to press **Send** in WhatsApp. Email and WhatsApp outcomes are reported separately; if the browser blocks the WhatsApp popup, a fallback link is shown.

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

The admin access state is currently held in browser `sessionStorage`; there is no custom server-side authentication or backend. Callback email delivery uses the EmailJS third-party API from the browser. Billing drafts are saved only in the current browser and are not synced to a server or automatically restored into the form.
Reservations and Settings currently display introductory placeholder text; the billing route contains the working invoice workflow.

## Brochure asset

The landing page's **BROCHURE** action downloads `public/images/broucher.png`. `public/Ren-Rental-Brochure.pdf` is not referenced by the application code, but Vite copies it into the production output, where it is available as `/Ren-Rental-Brochure.pdf`.
