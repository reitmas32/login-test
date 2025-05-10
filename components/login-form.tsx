"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>();

  async function onSubmit(values: LoginFormValues) {
    try {
      const res = await fetch(
        "https://accounts-g9nj.onrender.com/api/v1/emails/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.message || "Error en el login");
      }
      const { body, success } = (await res.json()) as {
        body: { jwt: string; refresh_token: string };
        success: boolean;
      };
      if (!success) throw new Error("Login fallido");
      localStorage.setItem("token", body.jwt);
      localStorage.setItem("refreshToken", body.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError("password", { message: err.message });
    }
  }

  async function handleGoogleLogin() {
    try {
      const res = await fetch(
        "https://accounts-g9nj.onrender.com/api/v1/platforms/link/google",
        { method: "GET" }
      );
      if (!res.ok) throw new Error("No se pudo iniciar OAuth con Google");
      const { body, success } = (await res.json()) as {
        body: string;
        success: boolean;
      };
      if (!success) throw new Error("Respuesta inesperada del servidor");
      window.location.href = body;
    } catch (err: any) {
      console.error("Error Google OAuth:", err);
      alert(err.message);
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-sm">
            Ingresa tu correo para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato de email inválido",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Botón de Login */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Login"}
            </Button>

            {/* Botón de Google debajo */}
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={handleGoogleLogin}
              type="button"
            >
              <FaGoogle className="w-5 h-5 text-[#4285F4]" />
              Login con Google
            </Button>

            {/* Pie de formulario */}
            <div className="mt-4 text-center text-sm">
              ¿No tienes cuenta?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-4 hover:text-blue-600"
              >
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
