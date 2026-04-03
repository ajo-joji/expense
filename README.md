# Expense Tracker

🚀 **Live Demo:** [https://expense-lhf2b2vz8-expensee.vercel.app/](https://expense-lhf2b2vz8-expensee.vercel.app/)

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

- **Framework & Hosting**: [Next.js](https://nextjs.org/) (App Router), deployed on **[Vercel](https://vercel.com/)**
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, [Lucide React](https://lucide.dev/) for icons
- **Database & Auth**: **[Supabase](https://supabase.com/)** (PostgreSQL, edge functions, Google OAuth). Vercel acts as the backend api/frontend, while Supabase deals with the database and authentication.
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

## Philosophy & Origin

This project was built to solve the classic "who owes who" dilemma with a highly responsive, modern interface. By leveraging Next.js 16 and Supabase, it serves as an impeccable template for robust full-stack development, transitioning smoothly from an idea into production.

## 🤫 Secret Hacks for AI Coding Tools

Ever wondered how to get the most out of AI coding assistants while building a complex full-stack project like this? Here are our top "secret hacks":

1. **Write "Types-First"**: Always explicitly declare your TypeScript types, Zod schemas, and database interfaces _first_. AI models lock onto strict typing to write much more secure and predictable feature code.
2. **Component Isolation**: Request code generation on isolated, single-responsibility components instead of large, complex page files. The smaller the context required to solve the problem, the cleaner the AI's logic will be.
3. **Draft Visuals, Hook Data Later**: Iterate entirely on the frontend UI and aesthetics first, reviewing the visual design, before asking the AI to bind it to a backend or state manager (like React Query).
4. **Iterative Stepping**: Don't prompt for a complex feature all at once. Step through it: "First, build the UI mock. Good, now wire the UI mock to this Next.js Server Action. Good, now add error handling."
5. **Feed the Raw Logs**: If a test or component fails, don't summarize the error—paste the _entire_ raw console trace log. AI models are heavily trained on specific runtime log structures and can spot clues humans miss.
