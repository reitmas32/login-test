"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  // Datos simulados
  const stats = [
    { title: "Usuarios", value: "1,234" },
    { title: "Ventas hoy", value: "$5,678" },
    { title: "Visitas", value: "9,012" },
  ];

  const recent = [
    { id: 1, event: "Login exitoso", user: "ana@correo.com", time: "Hace 2m" },
    { id: 2, event: "Signup",       user: "juan@correo.com", time: "Hace 10m" },
    { id: 3, event: "Compra",       user: "maria@correo.com", time: "Hace 1h" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con título y logout */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Bienvenido al Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border p-6">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actividad reciente */}
      <Card className="border p-6">
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ul className="divide-y">
            {recent.map((r) => (
              <li
                key={r.id}
                className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <strong>{r.event}</strong>
                  <span className="text-sm text-muted-foreground">{r.user}</span>
                </div>
                <span className="text-sm text-muted-foreground">{r.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Acción adicional */}
      <div className="flex justify-center sm:justify-end">
        <Button>Ver todos los reportes</Button>
      </div>
    </div>
  );
}
