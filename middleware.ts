// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  console.log(`[middleware] 🚀 Petición a: ${pathname} | query: ${req.nextUrl.search}`);

  // Solo interceptamos /login
  if (pathname === "/login") {
    // Leemos el token del query param "jwt"
    const token = searchParams.get("jwt");
    console.log(`[middleware] 🔍 Token desde query: ${token ?? "ninguno"}`);

    if (token) {
      // Creamos una nueva URL sin el param "jwt"
      const url = req.nextUrl.clone();
      url.searchParams.delete("jwt");
      console.log(`[middleware] 🔄 Reescribiendo a: ${url.toString()}`);

      // Reescribimos la petición y seteamos la cookie
      const res = NextResponse.rewrite(url);
      res.cookies.set("auth_token", token, {
        path: "/",
        sameSite: "lax",
      });
      console.log(`[middleware] ✅ Cookie auth_token seteada`);
      return res;
    }

    console.log(`[middleware] ⚠️ No hay jwt en query, pasando al siguiente`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login"],
};
