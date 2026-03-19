import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/topnav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 w-full">
                <TopNav />
                <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 min-h-[calc(100vh-theme(spacing.16))] animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
