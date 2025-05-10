"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface VerifyFormValues {
  code: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "";
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<VerifyFormValues>();

  async function onSubmit(values: VerifyFormValues) {
    try {
      const res = await fetch(
        "https://accounts-g9nj.onrender.com/api/v1/emails/activate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: values.code, email }),
        }
      );
      if (res.status !== 200) {
        const err = await res.json();
        throw new Error(err.body?.message || "Código inválido");
      }
      // Verificación exitosa, redirige al login
      router.push("/login");
    } catch (err: any) {
      setError("code", { message: err.message });
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50")}>
      {/* Botón de regresar */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/signup")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verifica tu cuenta</CardTitle>
          {message && <CardDescription>{message}</CardDescription>}
          {email && (
            <CardDescription className="mt-1">
              Correo: <strong>{email}</strong>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-1">
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                type="text"
                placeholder="Ingresa el código"
                {...register("code", {
                  required: "El código es obligatorio",
                })}
              />
              {errors.code && (
                <span className="text-red-600 text-sm">
                  {errors.code.message}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verificando..." : "Verificar cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
