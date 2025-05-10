"use client";

import { useRouter } from "next/navigation";
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

interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<SignUpFormValues>({
        defaultValues: { email: "", password: "", confirmPassword: "" },
    });

    async function onSubmit(values: SignUpFormValues) {
        if (values.password !== values.confirmPassword) {
            setError("confirmPassword", { message: "Las contraseñas no coinciden" });
            return;
        }

        try {
            const res = await fetch(
                "https://accounts-g9nj.onrender.com/api/v1/emails/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                        role: "admin",
                    }),
                }
            );

            // Cuando el endpoint retorna 201: usuario creado
            if (res.status === 200) {
                const {
                    body: { message },
                    success,
                }: { body: { message: string }; success: boolean } = await res.json();

                if (!success) {
                    throw new Error("Registro fallido");
                }

                // Redirige a la página de verificación con el mensaje
                router.push(`/verify?message=${encodeURIComponent(message)}&email=${values.email}`);
                return;
            }

            // Para otros códigos no exitosos, mostramos error
            if (!res.ok) {
                const errBody = await res.json();
                throw new Error(errBody.body?.message || "Error en el registro");
            }
        } catch (err: any) {
            setError("email", { message: err.message });
        }
    }

    async function handleGoogleSignUp() {
        try {
            const res = await fetch(
                "https://accounts-g9nj.onrender.com/api/v1/platforms/link/google",
                { method: "GET" }
            );
            if (!res.ok) throw new Error("No se pudo iniciar OAuth con Google");

            const { body, success }: { body: string; success: boolean } = await res.json();
            if (!success) throw new Error("Respuesta inesperada del servidor");

            window.location.href = body;
        } catch (err: any) {
            console.error(err);
            setError("email", { message: err.message });
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="absolute top-4 left-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Crear cuenta</CardTitle>
                    <CardDescription>Regístrate para crear tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                {...register("email", {
                                    required: "El email es obligatorio",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Formato de email inválido",
                                    },
                                })}
                            />
                            {errors.email && (
                                <span className="text-red-600 text-sm">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                                })}
                            />
                            {errors.password && (
                                <span className="text-red-600 text-sm">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Confirma la contraseña",
                                })}
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-600 text-sm">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Registrando..." : "Sign up"}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                            onClick={handleGoogleSignUp}
                        >
                            Regístrate con Google
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
