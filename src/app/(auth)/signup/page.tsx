import { SignupForm } from "@/components/forms/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Expense Tracker",
};

export default function SignupPage() {
    return <SignupForm />;
}
