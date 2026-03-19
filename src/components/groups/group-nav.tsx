import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReceiptText, Users, Scale } from "lucide-react";

export function GroupNav({ groupId }: { groupId: string }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Expenses", href: `/groups/${groupId}`, icon: ReceiptText },
        { name: "Balances", href: `/groups/${groupId}/balances`, icon: Scale },
        { name: "Members", href: `/groups/${groupId}/members`, icon: Users },
    ];

    return (
        <div className="flex border-b mb-6 overflow-x-auto">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                            isActive
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}
