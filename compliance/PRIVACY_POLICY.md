# PensionTools — Privacy Policy

_Last updated: 27 August 2026._

## Who we are
PensionTools is provided by **Usefulish Ltd**, a company registered in England and Wales
(company number **17360947**), registered office **71-75 Shelton Street, Covent Garden, London,
WC2H 9JQ**. Usefulish Ltd is the **data controller** for the personal data described here.
Contact for any privacy question or request: **privacy@usefulish.uk**.
Usefulish Ltd is registered with the Information Commissioner's Office (ICO), registration
reference **ZC209401** (registered 29 July 2026).

## What this app is
PensionTools is a UK pension drawdown planning and stress-testing tool. It is **not financial
advice** — it performs calculations on figures you enter. You are responsible for the accuracy of
your inputs and any decisions you make.

## The personal data we process
To use the saving features you create an account and log in. We process:

| Category | Examples | Purpose | Lawful basis |
|---|---|---|---|
| Account identity | email address, display name, (Google) profile photo | create and secure your account | Contract |
| Saved plans ("scenarios") | plan name/notes, timestamps | let you save and reload your work | Contract |
| Financial data | portfolio balances over time, SIPP/ISA balances, target income, drawdowns | run your drawdown plan | Contract |
| State Pension | forecast start date and weekly amount (from your HMRC forecast) | income modelling | Contract |
| Tax details | allowances/bands you set, other taxable income, tax paid/projected | tax-efficient calculations | Contract |
| Ages / dates | current/retirement/end ages | planning horizon | Contract |
| Household budget | itemised spending you enter, including any health-related, dependent or partner costs | estimate your income needs | Contract |

All of the above is stored against your account in **Google Cloud Firestore**. We do **not** sell
your data, use it for advertising, or share it for marketing.

## Who processes your data on our behalf
- **Google / Firebase** (Firebase Authentication and Cloud Firestore) — account sign-in and data
  storage. Your saved plans and financial data are stored in Cloud Firestore in Google's
  **London (`europe-west2`)** region, in the UK. Firebase Authentication is a global Google
  service, so account identity data (email address, display name) may be processed on Google
  systems outside the UK, including the United States; that transfer is safeguarded by Google's
  certification under the UK Extension to the EU–US Data Privacy Framework and by Google Cloud's
  data processing terms (which incorporate the UK International Data Transfer Addendum / EU
  Standard Contractual Clauses where applicable).
- **Cloudflare** — serves the app at **pensiontools.uk** (Cloudflare Pages) and receives standard
  request metadata (IP address, browser) when you load the page. GitHub (Microsoft) provides
  supporting code-hosting infrastructure. Your financial data does not pass through either; it
  goes directly from your browser to Firebase.

We do not use analytics or advertising services in this app.

If you categorise an investment fund the app doesn't recognise, the ticker and the category you
chose are logged (with your account id) to an administrator-only list so the shared fund catalogue
can be improved. No financial amounts are included.

## How long we keep it
We keep your account and saved plans until you delete them. In the app you can wipe your saved
data at any time ("Reset"), or permanently delete your account **and** all data ("Delete
Account"). You can also ask us to delete everything by emailing **privacy@usefulish.uk**.

## Your rights
Under UK GDPR you can ask us to: access a copy of your data; correct it; delete it ("right to
erasure"); restrict or object to processing; or receive it in a portable format. Email
**privacy@usefulish.uk** and we will respond within one month. You can also complain to the ICO
(ico.org.uk).

## Security
Access to your data is restricted to your own account via authentication and database security
rules. Data is encrypted in transit. Please use a strong, unique password.

## Children
This app is intended for adults planning their own finances and is not directed at children.

## Changes
We will update this policy as the app changes and post the new version here.
