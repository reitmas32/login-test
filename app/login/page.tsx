// app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Leemos la cookie que puso el middleware
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));
    if (match) {
      const token = match.split("=")[1];
      // Guardamos donde guardas tú el token
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", ""); // si usas refresh también
      // Limpiamos la cookie (opcional)
      document.cookie = "auth_token=; Max-Age=0; path=/";
      // Redirigimos al dashboard
      router.push("/dashboard");
    }
  }, [router]);

  // Si no había token, mostramos el form normal
  return <LoginForm />;
}
