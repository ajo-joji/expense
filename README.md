# Expense Tracker

A modern, responsive, Splitwise-inspired expense-sharing web application. It allows you to track personal expenses, analyze spending habits, and split expenses within groups.

## Features

- **Personal Expense Tracking**: Manually add and track your daily expenses.
- **Group Shared Expenses**: Splitwise-style expense sharing within groups.
- **Balance Tracking & Settlements**: Keep track of who owes who and settle debts easily.
- **Reporting & Analysis**: Visualize your spending with charts and generate PDF reports.
- **Authentication**: Secure Google OAuth authentication.
- **Legal Compliance**: Built-in Privacy Policy and Terms of Service for production readiness.

## Tech Stack

This project is built with a modern web stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React server components)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, [Lucide React](https://lucide.dev/) for icons
- **Data & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, edge functions, Googl OAuth)
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query/latest)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/) for unit testing, [Playwright](https://playwright.dev/) for E2E
- **PDF Generation**: `jspdf` and `jspdf-autotable`

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your Supabase environment variables in `.env.local` based on the `.env.example` file.

Then, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## Project Architecture

- `/src/app`: Next.js App Router endpoints and pages (e.g., Dashboard, Terms, Groups).
- `/src/services`: Database interaction and business logic for groups, shared expenses, etc.
- `/tests` & `/__tests__`: Playwright E2E and Vitest unit testing suites.
- `/supabase`: Supabase configuration and migration files.
