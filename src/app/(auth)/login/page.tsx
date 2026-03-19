import { LoginForm } from "@/components/forms/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Expense Tracker",
};

export default function LoginPage() {
    return <LoginForm />;
}
