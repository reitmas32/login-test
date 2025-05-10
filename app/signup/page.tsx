// app/signup/page.tsx
"use client"; // Si tu página usa hooks de estado o efectos

import { SignUpForm } from "@/components/SignupForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}