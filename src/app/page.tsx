import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, PieChart, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center gap-2" href="/">
          <PieChart className="h-6 w-6 text-emerald-500" />
          <span className="font-bold text-xl">ExpenseTracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Take control of your finances today.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track your expenses, manage budgets, and achieve your financial goals with our secure and modern platform.
                </p>
              </div>
              <div className="space-x-4 mt-6">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8">
                    Start for free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-emerald-100 rounded-full dark:bg-emerald-900/20">
                  <BarChart3 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold">Smart Analytics</h2>
                <p className="text-muted-foreground">Detailed charts and reports to help you understand your spending habits.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-blue-100 rounded-full dark:bg-blue-900/20">
                  <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Budget Management</h2>
                <p className="text-muted-foreground">Set custom budgets for categories and stay on top of your limits.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-purple-100 rounded-full dark:bg-purple-900/20">
                  <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Secure by Design</h2>
                <p className="text-muted-foreground">Your financial data is protected with enterprise-grade row level security.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 SplitShare Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground transition-colors hover:text-foreground" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground transition-colors hover:text-foreground" href="/privacy">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
