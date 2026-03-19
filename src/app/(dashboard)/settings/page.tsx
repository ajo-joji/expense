"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState("");
    const [currency, setCurrency] = useState("EUR");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setFullName(user.user_metadata?.full_name || "");

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || user.user_metadata?.full_name || "");
                    setCurrency(profile.currency || "EUR");
                }
            }
            setLoading(false);
        }
        loadProfile();
    }, [supabase]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Update user metadata
        await supabase.auth.updateUser({
            data: { full_name: fullName }
        });

        // Update profiles table
        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: fullName,
                currency: currency
            });

        setSaving(false);
        if (error) {
            setMessage("Error saving Profile.");
        } else {
            setMessage("Profile updated successfully!");
            router.refresh();
        }
    }

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal information and application preferences.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Display Currency</Label>
                            <select
                                id="currency"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="EUR">Euro (€)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="GBP">British Pound (£)</option>
                                <option value="INR">Indian Rupee (₹)</option>
                                <option value="JPY">Japanese Yen (¥)</option>
                            </select>
                        </div>
                        {message && (
                            <p className={`text-sm font-medium ${message.includes('Error') ? 'text-destructive' : 'text-emerald-500'}`}>
                                {message}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Log out of your account on this device.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/login");
                            router.refresh();
                        }}
                    >
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
