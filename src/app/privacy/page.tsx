import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | SplitShare",
  description: "How we securely handle and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-3xl rounded-2xl border border-border/50 bg-card p-8 md:p-12 shadow-[var(--shadow-premium)] animate-fade-in">
        <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl text-foreground">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: March 19, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              When you use SplitShare to track and split expenses, we collect information that you 
              provide to us directly, including but not limited to your name, email address, profile 
              image, and custom expense tracking data. If you authenticate using Google, we access 
              your email address and full name to create a secure account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Data</h2>
            <p>We use the information we collect strictly to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve the core functionality of the Application.</li>
              <li>Securely authenticate you via OAuth providers like Google.</li>
              <li>Calculate expense settlements and splits between your designated group members.</li>
              <li>Communicate with you regarding important updates to the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
            <p>
              All application data is securely transmitted and stored using Supabase (PostgreSQL), which 
              utilizes industry-standard encryption protocols. Your data is isolated using strict Row-Level 
              Security (RLS) policies guaranteeing that your private and shared group expenses cannot be 
              accessed by unauthorized users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information. We only share information with 
              necessary infrastructure providers (like Supabase and Google) strictly to facilitate the 
              application's primary services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Deletion & Your Rights</h2>
            <p>
              You have the right to request that your account and all associated data be permanently deleted. 
              To exercise this right or any other questions regarding your privacy, please contact us at 
              <br />
              <a href="mailto:privacy@splitshare-demo.com" className="text-primary hover:underline">privacy@splitshare-demo.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex justify-between items-center">
          <Link href="/" className="text-sm font-medium text-primary hover:underline transition-colors">
            &larr; Return to Home
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
