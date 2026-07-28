# Pension Planner PWA

A Progressive Web App for pension drawdown planning with Monte Carlo stress testing.

## Features

- **Decision Tool**: Monthly pension drawdown tracking with PACW/CGT/CSH2 fund calculations
- **Stress Tester**: Monte Carlo simulation (1,000 runs), historical sequence analysis, and stress scenarios
- **Tax-Efficient**: Optimizes SIPP withdrawals to stay within basic rate tax band
- **Glidepath Strategy**: Inflation-adjusted fund minimums with depletion curves
- **Protection Mode**: Automatic defensive posture during consecutive CSH2 draws
- **Offline Support**: Works without internet once installed

## Usage

Visit the hosted version at: https://magicdogsbrain.github.io/pension-planner-pwa/

Or run locally:
```bash
# Serve with any static file server
npx serve .
# or
python3 -m http.server 8000
```

## Data Storage

Data is stored server-side in **Cloud Firestore** (Google Firebase, London/`europe-west2` region),
tied to your account — sign-in (email/password or Google) is required to save and load. Firestore
security rules restrict every user to their own data. See `compliance/PRIVACY_POLICY.md` (published
in-app as `privacy.html`) and `compliance/GDPR_TODO.md` for the data-protection posture.

## License

MIT
