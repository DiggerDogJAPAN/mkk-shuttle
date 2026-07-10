# MKK Shuttle

MKK Shuttle is a comprehensive online airport shuttle booking service, facilitating direct transfers between Tokyo airports (Narita and Haneda) and the Myoko region in Japan.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, class-variance-authority, lucide-react
- **Database / Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **Payments**: Stripe (Checkout Sessions, Webhooks)
- **Email**: Resend
- **Language**: TypeScript

## Local Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd myoko-shuttle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Variable Setup

This project requires environment variables to connect to Supabase, Stripe, and Resend.

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and replace the placeholder values with your real development keys.

> **WARNING:** Real credentials must NEVER be committed to version control. Always ensure `.env.local`, `.env`, and similar files remain in your `.gitignore` and are not accidentally staged.

## Commands

### Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site in your browser.

### Production Build
To create a production-ready optimized build:
```bash
npm run build
```

To start the production server:
```bash
npm start
```
