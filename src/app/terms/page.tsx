import Link from "next/link";

export const metadata = {
  title: "Terms of Service | SplitShare",
  description: "Terms and conditions for using our platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-3xl rounded-2xl border border-border/50 bg-card p-8 md:p-12 shadow-[var(--shadow-premium)] animate-slide-up">
        <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl text-foreground">Terms of Service</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: March 19, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the SplitShare application, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Acceptable Use</h2>
            <p>
              You agree not to use the Application for any unlawful or prohibited purpose. You may not use the Application 
              to harass, abuse, or harm another person. You are fully responsible for the accuracy of financial debt information 
              entered into your groups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Rules</h2>
            <p>
              Users must provide accurate, complete, and current information when registering via Google OAuth or local email. 
              You are responsible for safely maintaining the confidentiality of your account credentials. We reserve the right to 
              terminate accounts that provide false information or violate these rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Disclaimer & Limitations of Liability</h2>
            <p>
              The Application is provided "AS IS" and "AS AVAILABLE". We are not a licensed financial institution or payment 
              processor. SplitShare merely acts as a calculator for personal debts. We make no warranty that the Application will 
              operate flawlessly or be completely error-free. Under no circumstances will the creators of SplitShare be liable 
              for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Termination</h2>
            <p>
              We reserve the right, without notice and at our sole discretion, to terminate your right to use the Service 
              or any portion thereof, and to block or prevent your future access to and use of the Application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Information</h2>
            <p>
              If you have any questions regarding these terms, please reach out to our team at 
              <br />
              <a href="mailto:legal@splitshare-demo.com" className="text-primary hover:underline">legal@splitshare-demo.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex justify-between items-center">
          <Link href="/" className="text-sm font-medium text-primary hover:underline transition-colors">
            &larr; Return to Home
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
