"use client";

import Link from "next/link";
import { Menu, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Personal Expenses", href: "/expenses" },
    { name: "Analytics", href: "/analytics" },
    { name: "Categories", href: "/categories" },
    { name: "Groups", href: "/groups" },
    { name: "History", href: "/history" },
    { name: "Export", href: "/export" },
    { name: "Settings", href: "/settings" },
];

export function TopNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        queryClient.clear();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute left-0 top-14 z-50 w-full border-b bg-background p-4 sm:hidden shadow-lg">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Wallet className="h-5 w-5" />
                            <span>ExpenseTracker</span>
                        </Link>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                                    pathname === item.href ? "bg-muted text-foreground" : ""
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4 relative" ref={profileRef}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-muted border"
                    onClick={() => setProfileOpen(!profileOpen)}
                >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>

                {profileOpen && (
                    <div className="absolute top-12 right-0 mt-2 w-48 rounded-md bg-popover border shadow-md text-popover-foreground z-50 overflow-hidden">
                        <div className="flex flex-col py-1">
                            <button 
                                onClick={() => { setProfileOpen(false); router.push("/settings"); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left transition-colors"
                            >
                                <SettingsIcon className="h-4 w-4" />
                                <span>Settings</span>
                            </button>
                            <div className="border-t border-border my-1"></div>
                            <button 
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted text-left transition-colors font-medium"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
